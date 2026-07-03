import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vacpndyyddotnkcjegci.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhY3BuZHl5ZGRvdG5rY2plZ2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTYzOTgsImV4cCI6MjA5NTczMjM5OH0.fkj0PaNMehLauvACWjlP3y_vm4bGg2Z4_DDKvrY4Kyg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const amount = 100;
  const reference = "TESTREF";
  const userBankDetails = undefined;
  const systemBankDetails = { bankName: 'USDT', accountNumber: 'TRC20 Wallet', accountName: 'Equinor USDT' };
  
  const { data, error } = await supabase.from('transactions').insert([
    {
      userId: '7d27e9e9-ed77-4bbc-9ccb-0d53a9cb4c7f',
      type: 'deposit',
      amount,
      status: 'pending',
      date: new Date().toISOString(),
      bankDetails: {
        reference,
        userBankDetails,
        systemBankDetails
      }
    }
  ]).select().single();
  console.log(data, error);
}
test();
