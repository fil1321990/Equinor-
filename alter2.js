import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { error, data } = await supabase.rpc('query', { 
    query_text: `ALTER TABLE products ADD COLUMN IF NOT EXISTS "countsForVip" boolean DEFAULT true;`
   });
  console.log("Alter Error:", error, data);
}
run();
