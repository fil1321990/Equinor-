import { supabase } from './src/supabase';
async function run() {
  const { data, error } = await supabase.from('users').select('*').eq('email', 'doriangrey0366@gmail.com');
  console.log('Result:', data);
}
run();
