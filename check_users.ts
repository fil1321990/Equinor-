import { createClient } from '@supabase/supabase-js';

async function run() {
  const url = process.env.VITE_SUPABASE_URL.replace('/rest/v1/', '');
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('users').select('id, name, email, role');
  console.log('All users:', data);
}
run();
