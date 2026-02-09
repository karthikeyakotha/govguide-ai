
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCount() {
    const { count, error } = await supabase
        .from('schemes')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error checking count:', error);
    } else {
        console.log(`\n✅ Total schemes in database: ${count}`);
    }
}

checkCount();
