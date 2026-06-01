import { createClient } from '@supabase/supabase-js';

async function test() {
  try {
    const rawSupabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vacpndyyddotnkcjegci.supabase.co/rest/v1/';
    const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
    const supabase = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhY3BuZHl5ZGRvdG5rY2plZ2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTYzOTgsImV4cCI6MjA5NTczMjM5OH0.fkj0PaNMehLauvACWjlP3y_vm4bGg2Z4_DDKvrY4Kyg');
    
    console.log("Checking users...");
    const { data: users, error: selectErr } = await supabase.from('users').select('*');
    console.log("Users:", users?.length, selectErr);

    console.log("Attempting insert...");
    const { data: insertData, error: insertErr } = await supabase.from('users').insert({
      email: 'test_foo@bar.com',
      name: 'Test Foo'
    }).select();
    console.log("Insert result:", insertData, insertErr);
    
    // cleanup
    if (insertData) await supabase.from('users').delete().eq('email', 'test_foo@bar.com');
  } catch(e) {
    console.error("Exception:", e);
  }
}
test();
