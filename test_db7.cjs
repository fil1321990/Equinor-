require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const rawSupabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: insertData, error: insertError } = await supabase.from('incomeRecords').insert({
    userId: '22222222-2222-2222-2222-222222222222',
    investmentId: 'ed8bca5f-57a3-427b-9445-fda981efcfa2',
    planName: 'Test',
    amount: 1,
    date: new Date().toISOString()
  }).select();
  console.log("incomeRecords insert result:", insertData, insertError);
}
run();
