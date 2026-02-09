
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const githubToken = process.env.VITE_GITHUB_TOKEN;

if (!supabaseUrl || !supabaseKey || !githubToken) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const openai = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: githubToken,
});

// Helper for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getEmbeddingWithRetry(text, retries = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            return await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: text,
            });
        } catch (e) {
            if (e.status === 429 && i < retries - 1) {
                const waitTime = 2000 * Math.pow(2, i); // Exponential backoff
                console.log(`\n[429] Rate limit hit, waiting ${waitTime / 1000}s...`);
                await delay(waitTime);
                continue;
            }
            throw e;
        }
    }
}

async function ingestFile(filePath) {
    console.log(`\n[RAG] Processing: ${path.basename(filePath)}`);

    try {
        const buffer = fs.readFileSync(filePath);
        const uint8Array = new Uint8Array(buffer);

        const loadingTask = pdfjsLib.getDocument(uint8Array);
        const doc = await loadingTask.promise;

        console.log(`[RAG] Pages: ${doc.numPages}`);

        let fullText = '';
        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const content = await page.getTextContent();
            // @ts-ignore
            let pageText = content.items.map(item => item.str).join(' ');

            // Extract links from annotations
            const annotations = await page.getAnnotations();
            const links = annotations
                // @ts-ignore
                .filter(a => a.subtype === 'Link' && a.url)
                // @ts-ignore
                .map(a => ` [Link: ${a.url}] `)
                .join('');

            if (links) {
                pageText += `\nReferenced Links: ${links}`;
            }

            fullText += pageText + '\n';
        }

        if (fullText.length === 0) {
            console.log('[WARN] Empty text, skipping');
            return;
        }

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const chunks = await splitter.createDocuments([fullText]);
        console.log(`[RAG] Created ${chunks.length} chunks`);

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const content = chunk.pageContent;

            try {
                // Add artificial delay to respect rate limits
                await delay(500);

                const embeddingResponse = await getEmbeddingWithRetry(content);

                const embedding = embeddingResponse.data[0].embedding;

                const { error } = await supabase.from('documents').insert({
                    content,
                    metadata: { source: path.basename(filePath), chunk_index: i },
                    embedding
                });

                if (error) {
                    console.error(`[Error] Chunk ${i}:`, error.message);
                } else if ((i + 1) % 10 === 0) {
                    process.stdout.write('.');
                }

            } catch (e: any) {
                console.error(`[Error] Chunk ${i}:`, e.message);
            }
        }
        console.log('\n[RAG] File Done!');

    } catch (e: any) {
        console.error('[FATAL]', e.message);
    }
}

async function runBatch() {
    const publicDir = path.resolve('public');
    const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.pdf'));

    console.log(`Found ${files.length} PDF files:`);
    files.forEach(f => console.log(`- ${f}`));

    for (const file of files) {
        await ingestFile(path.join(publicDir, file));
    }
}

runBatch();
