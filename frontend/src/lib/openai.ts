import OpenAI from 'openai';
import { supabase } from './supabase';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GITHUB_TOKEN_BACKUP = import.meta.env.VITE_GITHUB_TOKEN_BACKUP;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o-mini";

if (!GITHUB_TOKEN) {
    throw new Error('Missing GitHub token');
}

// Initialize with primary token
// We will allow swapping this client if 401 occurs
let currentToken = GITHUB_TOKEN;
export let openaiClient = new OpenAI({
    baseURL: endpoint,
    apiKey: currentToken,
    dangerouslyAllowBrowser: true
});

// Function to switch to backup token
function rotateKey() {
    if (currentToken === GITHUB_TOKEN && GITHUB_TOKEN_BACKUP) {
        console.warn('[API] Switching to Backup GitHub Token...');
        currentToken = GITHUB_TOKEN_BACKUP;
        openaiClient = new OpenAI({
            baseURL: endpoint,
            apiKey: currentToken,
            dangerouslyAllowBrowser: true
        });
        return true;
    }
    return false;
}

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}


// Helper for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryOperation<T>(operation: () => Promise<T>, retries = 3): Promise<T> {
    for (let i = 0; i < retries; i++) {
        try {
            return await operation();
        } catch (error: any) {
            // Check for Unauthorized (401) to trigger key rotation
            if (error?.status === 401) {
                console.error('[API] Auth Error (401). Attempting key rotation...');
                if (rotateKey()) {
                    // If rotation occurred, retry immediately with new key
                    continue;
                }
            }

            if (error?.status === 429 && i < retries - 1) {
                const waitTime = 1000 * Math.pow(2, i);
                console.warn(`[API] Rate limit hit. Retrying in ${waitTime}ms...`);
                await delay(waitTime);
                continue;
            }
            throw error;
        }
    }
    throw new Error('Max retries exceeded');
}

export async function getChatCompletion(messages: ChatMessage[]): Promise<string> {
    try {
        // 1. Get the latest user message to search for context
        const lastUserMessage = messages.slice().reverse().find(m => m.role === 'user');
        let contextText = "";

        if (lastUserMessage) {
            // 2. Generate embedding for the query (with retry)
            const embeddingResponse = await retryOperation(() => openaiClient.embeddings.create({
                model: 'text-embedding-3-small',
                input: lastUserMessage.content,
            }));
            const embedding = embeddingResponse.data[0].embedding;

            // 3. Search for relevant documents in Supabase (Vector Search)
            const { data: documentParams, error: docError } = await supabase.rpc('match_documents', {
                query_embedding: embedding,
                match_threshold: 0.5,
                match_count: 5
            });

            if (docError) console.error('Supabase Vector Search Error:', docError);

            // 3b. Search for relevant SCHEMES (Keyword Search as fallback/augmentation)
            // We search across Name, Beneficiaries, and Category to catch requests like "schemes for farmers"
            const { data: schemeData, error: schemeError } = await supabase
                .from('schemes')
                .select('*')
                .or(`Scheme_Name.ilike.%${lastUserMessage.content}%,Target_Beneficiaries.ilike.%${lastUserMessage.content}%,Category.ilike.%${lastUserMessage.content}%`)
                .limit(4);

            if (schemeError) console.warn('Supabase Scheme Search Error:', schemeError);

            // Fallback: If the user query is long (e.g. natural language question), simple ILIKE might fail.
            // In a full production app, we would use Vector Search for schemes too (requires embedding generation for the table).
            // For now, this OR query covers most keyword-based lookups.

            let finalSchemeData = schemeData || [];

            // 4. Construct context string
            let docContext = "";
            let schemeContext = "";

            if (documentParams && documentParams.length > 0) {
                docContext = documentParams.map((doc: any) => doc.content).join('\n---\n');
            }

            if (finalSchemeData.length > 0) {
                schemeContext = finalSchemeData.map((s: any) =>
                    `SCHEME: ${s.Scheme_Name}
                    Category: ${s.Category}
                    Beneficiaries: ${s.Target_Beneficiaries}
                    Benefits: ${s.Benefits_Provided}
                    Eligibility: ${s.Eligibility_Criteria}
                    Application: ${s.Application_Process}
                    Link: ${s.Official_Website_Link}`
                ).join('\n---\n');
            }

            contextText = `
            ${docContext ? `RELEVANT DOCUMENTS:\n${docContext}` : ''}
            
            ${schemeContext ? `RELEVANT SCHEMES:\n${schemeContext}` : ''}
            `;

            console.log(`Context: ${documentParams?.length || 0} docs, ${finalSchemeData.length} schemes`);
        }

        // 5. Prepare system message with context
        const systemPrompt = `You are GovGuide AI, a helpful and official government service assistant for Indian citizens. 
    
    Start with a friendly greeting if it's the start of the conversation.
    
    Answer the user's question based STRICTLY on the following context if provided. If the answer is not in the context, say "I don't have specific information about that in my current database, but generally..." and provide general knowledge.
    
    Context from Government Documents:
    ${contextText}
    
    Formatting Rules:
    - Use clear headings (##)
    - Use bullet points for steps or lists
    - Use bold for key terms
    - Be concise and professional
    - Support English, Hindi, and Telugu (detect language from user input)
    - **CRITICAL**: If the user asks about a scheme, ALWAYS provide the official application link/website URL if it exists in the context or is widely known. Format it as: **Application Link:** [URL].
    `;

        // 6. Send to LLM (with retry)
        const response = await retryOperation(() => openaiClient.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                ...messages
            ],
            model: modelName,
            temperature: 0.5, // Lower temperature for more grounded answers
            max_tokens: 1000,
        }));

        return response.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
    } catch (error: any) {
        console.error('OpenAI API Error:', error);
        // Return a more user-friendly error if it's a rate limit
        if (error?.status === 429) {
            throw new Error('The system is currently busy. Please try again in a few seconds.');
        }
        throw new Error('Failed to get AI response. Please check your connection and try again.');
    }
}
