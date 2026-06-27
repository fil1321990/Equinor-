import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
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
