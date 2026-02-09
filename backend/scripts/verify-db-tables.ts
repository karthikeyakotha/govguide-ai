
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyTables() {
    console.log('Verifying Supabase Tables...');

    // 1. Check Auth (Validation)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    // note: using anon key, we might not be logged in as a user here so strict RLS checks might fail if we try to select.
    // However, we can try to *insert* if we had a user, or check for error messages that indicate "relation does not exist".

    // We'll try to select from 'conversations' with a limit of 0.
    // Even with RLS, if the table exists, we usually get a 200 OK (empty list) or 401. 
    // If table doesn't exist, we get 404 or specific error.

    console.log('Checking "conversations" table...');
    const { error: convError } = await supabase.from('conversations').select('*').limit(1);

    if (convError) {
        if (convError.code === '42P01') { // PostgreSQL code for undefined table
            console.error('❌ Table "conversations" DOES NOT EXIST.');
            console.error('ACTION REQUIRED: Run the SQL in supabase_schema.sql');
        } else {
            console.error('⚠️ Error accessing "conversations":', convError.message, convError.code);
            if (convError.code === 'PGRST301') {
                console.log('ℹ️ Table exists (PGRST301 implies permission issue, which is good - table exists).');
            }
        }
    } else {
        console.log('✅ Table "conversations" exists.');
    }

    console.log('Checking "messages" table...');
    const { error: msgError } = await supabase.from('messages').select('*').limit(1);

    if (msgError) {
        if (msgError.code === '42P01') {
            console.error('❌ Table "messages" DOES NOT EXIST.');
        } else {
            console.error('⚠️ Error accessing "messages":', msgError.message);
        }
    } else {
        console.log('✅ Table "messages" exists.');
    }
}

verifyTables();
