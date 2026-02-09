
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

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

async function run() {
    const path = process.argv[2];
    if (!path) {
        console.error('No path provided');
        process.exit(1);
    }

    console.log(`[RAG] Processing: ${path}`);

    try {
        if (!fs.existsSync(path)) throw new Error('File not found');

        // Read file as Uint8Array
        const buffer = fs.readFileSync(path);
        const uint8Array = new Uint8Array(buffer);
        console.log(`[RAG] Read ${buffer.length} bytes`);

        console.log(`[RAG] Parsing PDF with pdfjs-dist...`);
        const loadingTask = pdfjsLib.getDocument(uint8Array);
        const doc = await loadingTask.promise;

        console.log(`[RAG] PDF Loaded. Pages: ${doc.numPages}`);

        let fullText = '';
        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const content = await page.getTextContent();
            // @ts-ignore
            const pageText = content.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }

        console.log(`[RAG] Extracted ${fullText.length} chars`);

        if (fullText.length === 0) throw new Error('Empty text');

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const chunks = await splitter.createDocuments([fullText]);
        console.log(`[RAG] Created ${chunks.length} chunks`);

        console.log('[RAG] Indexing...');
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const content = chunk.pageContent;

            try {
                const embeddingResponse = await openai.embeddings.create({
                    model: 'text-embedding-3-small',
                    input: content,
                });

                const embedding = embeddingResponse.data[0].embedding;

                const { error } = await supabase.from('documents').insert({
                    content,
                    metadata: { source: path, chunk_index: i },
                    embedding
                });

                if (error) console.error(`[Error] Chunk ${i}:`, error.message);
                else {
                    if ((i + 1) % 10 === 0 || i === chunks.length - 1) {
                        console.log(`[RAG] Indexed ${i + 1}/${chunks.length}`);
                    }
                }

            } catch (e: any) {
                console.error(`[Error] Chunk ${i}:`, e.message);
            }
        }

        console.log('[RAG] Complete!');

    } catch (e: any) {
        console.error('[FATAL]', e.message);
        process.exit(1);
    }
}

run();
