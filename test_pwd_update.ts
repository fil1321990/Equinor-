import { createClient } from '@supabase/supabase-js';

async function run() {
  const url = process.env.VITE_SUPABASE_URL?.replace('/rest/v1/', '') || '';
  const key = process.env.VITE_SUPABASE_ANON_KEY || '';
  const supabase = createClient(url, key);
  
  const { data: user } = await supabase.from('users').select('*').eq('email', 'user@iconic.com').single();
  console.log("Before:", user?.password);
  
  if (user) {
    const { data: upd, error } = await supabase.from('users').update({ password: 'newpassword123' }).eq('id', user.id).select().single();
    console.log("After update:", upd?.password, error);
  }
}
run();
