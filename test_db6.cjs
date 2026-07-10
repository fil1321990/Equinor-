require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const rawSupabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase.from('investments').select('*').limit(1);
  if (!data || data.length === 0) return;
  const inv = data[0];
  const { data: updateData, error: updateError } = await supabase.from('investments').update({ status: inv.status }).eq('id', inv.id).select();
  console.log("investments update result:", updateData, updateError);
}
run();
