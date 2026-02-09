
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

async function checkSchema() {
    // Try to select specific columns to verify they exist
    const { data, error } = await supabase
        .from('schemes')
        .select(`
            Scheme_Name,
            Category,
            Target_Beneficiaries,
            Eligibility_Criteria,
            Benefits_Provided,
            Loan_Amount_or_Subsidy,
            Interest_Rate,
            Documents_Required,
            Application_Process,
            Application_Mode,
            Official_Website_Link,
            State_or_Central,
            State_Name
        `)
        .limit(1);

    if (error) {
        console.error('❌ Schema Verification Failed:', error.message);
    } else {
        console.log('✅ Schema Verification Passed: All columns exist.');
    }
}

checkSchema();
