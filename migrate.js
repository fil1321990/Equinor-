import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const rawSupabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const sql = `
    ALTER TABLE products ADD COLUMN IF NOT EXISTS total_duration_days int;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS payout_cycle_days int;
    
    ALTER TABLE investments ADD COLUMN IF NOT EXISTS total_duration_days int;
    ALTER TABLE investments ADD COLUMN IF NOT EXISTS payout_cycle_days int;
    
    UPDATE products SET total_duration_days = COALESCE(days, 30) WHERE total_duration_days IS NULL;
    UPDATE products SET payout_cycle_days = COALESCE("tPlusDays", 1) WHERE payout_cycle_days IS NULL;
    
    UPDATE investments SET total_duration_days = 30 WHERE total_duration_days IS NULL;
    UPDATE investments SET payout_cycle_days = COALESCE("tPlusDays", 1) WHERE payout_cycle_days IS NULL;
  `;
  const { data, error } = await supabase.rpc('query', { query_text: sql });
  if (error) {
    console.error("Error migrating:", error);
  } else {
    console.log("Migration successful", data);
  }
}

run();
