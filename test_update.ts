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
  
  const { data, error } = await supabase.from('users').update({ bankDetails: details }).eq('id', '11111111-1111-1111-1111-111111111111').select();
  console.log('Update result:', data, error);
}
run();
