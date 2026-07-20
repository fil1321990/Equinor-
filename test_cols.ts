import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL!.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabase = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY!);
async function run() {
  const { data, error } = await supabase.from('app_settings').select('*').limit(1);
  console.log('Error:', error);
  console.log('app_settings:', data);
}
run();
