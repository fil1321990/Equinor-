import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
  const dbRecord = {
    userId: "0a5d4812-3eb4-4448-9fce-e9b604b04d16", // we'll test without user
    investmentId: null,
    planName: "Test Bonus",
    amount: 200,
    date: new Date().toISOString()
  };
  const { data, error } = await supabase.from('incomeRecords').insert(dbRecord).select();
  console.log("Error:", error);
  console.log("Data:", data);
}

test();
