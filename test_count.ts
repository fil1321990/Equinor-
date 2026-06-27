import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vacpndyyddotnkcjegci.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhY3BuZHl5ZGRvdG5rY2plZ2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTYzOTgsImV4cCI6MjA5NTczMjM5OH0.fkj0PaNMehLauvACWjlP3y_vm4bGg2Z4_DDKvrY4Kyg';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
  const { count, error } = await supabase.from('incomeRecords').select('*', { count: 'exact', head: true });
  console.log("Count:", count);
}

test();
