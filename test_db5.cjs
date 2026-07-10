require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const rawSupabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase.from('users').update({ balance: 1000 }).eq('id', '11111111-1111-1111-1111-111111111111').select();
  console.log("update normal user result:", data, error);
}
run();
