
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function listCounts() {
    console.log('\n--- Database Stats ---');
    // Get all docs to aggregate in memory (simplest for now without custom RPC for distinct count)
    // Note: limiting to 10000 for safety, though RPC is better for large datasets.
    const { data, error } = await supabase.from('documents').select('metadata');

    if (error) {
        console.error('Error fetching stats:', error);
        return;
    }

    const counts: Record<string, number> = {};
    data?.forEach((row: any) => {
        const source = row.metadata?.source || 'Unknown';
        counts[source] = (counts[source] || 0) + 1;
    });

    if (Object.keys(counts).length === 0) {
        console.log('No documents found.');
        return [];
    }

    console.log('Documents by Source:');
    Object.entries(counts).forEach(([source, count], idx) => {
        console.log(`${idx + 1}. ${source} (${count} chunks)`);
    });

    return Object.keys(counts);
}

async function deleteSource(source: string) {
    console.log(`\nDeleting data for source: ${source}...`);
    // metadata is a JSONB column. Querying where metadata->>'source' matches.
    const { error } = await supabase
        .from('documents')
        .delete()
        .filter('metadata->>source', 'eq', source);

    if (error) console.error('Error deleting:', error);
    else console.log('✅ Deleted successfully.');
}

async function main() {
    const sources = await listCounts();
    if (!sources || sources.length === 0) process.exit(0);

    const answer = await new Promise<string>(resolve => {
        rl.question('\nEnter the number of the file to DELETE (or "all" to wipe everything, "q" to quit): ', resolve);
    });

    if (answer.toLowerCase() === 'q') {
        process.exit(0);
    }

    if (answer.toLowerCase() === 'all') {
        console.log('Deleting ALL documents...');
        const { error } = await supabase.from('documents').delete().neq('id', 0); // Hack to delete all
        if (error) console.error('Error:', error);
        else console.log('All documents deleted.');
    } else {
        const idx = parseInt(answer) - 1;
        if (idx >= 0 && idx < sources.length) {
            await deleteSource(sources[idx]);
        } else {
            console.log('Invalid selection');
        }
    }

    rl.close();
}

main();
