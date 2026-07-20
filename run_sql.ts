import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);
async function run() {
  const { error } = await supabase.rpc('execute_sql', { sql: 'ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS "showCSIcon" boolean DEFAULT true;' });
  console.log("Error:", error);
}
run();
