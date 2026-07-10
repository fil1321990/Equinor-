require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const rawSupabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase.from('users').update({ balance: 1 }).eq('id', '22222222-2222-2222-2222-222222222222').select();
  console.log("update result:", data, error);
}
run();
