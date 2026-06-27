import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vacpndyyddotnkcjegci.supabase.co'; // without /rest/v1/ to make createClient work
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhY3BuZHl5ZGRvdG5rY2plZ2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTYzOTgsImV4cCI6MjA5NTczMjM5OH0.fkj0PaNMehLauvACWjlP3y_vm4bGg2Z4_DDKvrY4Kyg';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
  const { data: users } = await supabase.from('users').select('id').limit(1);
  if (!users || users.length === 0) {
    console.log("No users found");
    return;
  }
  const userId = users[0].id;
  
  const dbRecord = {
    userId,
    planName: "Redemption Code",
    amount: 200,
    date: new Date().toISOString()
  };
  
  const { data, error } = await supabase.from('incomeRecords').insert(dbRecord).select();
  console.log("Insert Error:", error);
  console.log("Insert Data:", data);
}

test();
