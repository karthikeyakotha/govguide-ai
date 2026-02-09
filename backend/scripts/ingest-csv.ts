
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function ingest() {
    const csvPath = path.join(process.cwd(), 'public', 'Indian Government Schemes, Loans, and Policies Data Table.csv');
    console.log(`Reading CSV from: ${csvPath}`);

    try {
        const fileContent = fs.readFileSync(csvPath, 'utf-8');
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true
        });

        console.log(`Found ${records.length} records. Inserting into Supabase...`);

        // Insert in batches of 50 to be safe
        const batchSize = 50;
        for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize);
            const { error } = await supabase.from('schemes').insert(batch);

            if (error) {
                console.error(`Error inserting batch ${i}-${i + batchSize}:`, error);
            } else {
                console.log(`Inserted batch ${i}-${i + batchSize}`);
            }
        }

        console.log('✅ Ingestion complete!');

    } catch (err) {
        console.error('Error ingesting CSV:', err);
    }
}

ingest();
