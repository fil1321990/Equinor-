import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vacpndyyddotnkcjegci.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhY3BuZHl5ZGRvdG5rY2plZ2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTYzOTgsImV4cCI6MjA5NTczMjM5OH0.fkj0PaNMehLauvACWjlP3y_vm4bGg2Z4_DDKvrY4Kyg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const amount = 100;
  const reference = "TESTREF";
  
  const { data, error } = await supabase.from('transactions').insert([
    {
      userId: '11111111-1111-1111-1111-111111111111',
      type: 'deposit',
      amount,
      status: 'pending',
      date: new Date().toISOString(),
      bankDetails: {
        reference,
      }
    }
  ]).select().single();
  console.log("Tx Insert Result:", data, error);
}
test();
