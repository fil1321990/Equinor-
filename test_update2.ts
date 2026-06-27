import { createClient } from '@supabase/supabase-js';

async function run() {
  const url = process.env.VITE_SUPABASE_URL.replace('/rest/v1/', '');
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  const supabase = createClient(url, key);
  
  const details = {
    accountName: 'Test Name',
    accountNumber: '1234567890',
    bankCode: '001',
    bankName: 'Test Bank'
  };
  
  const { data, error } = await supabase.from('users').update({ bankDetails: details }).eq('id', '7d27e9e9-ed77-4bbc-9ccb-0d53a9cb4c7f').select();
  console.log('Update result:', data, error);
}
run();
