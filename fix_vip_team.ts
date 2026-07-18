import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const rawSupabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: existing } = await supabase.from('products').select('*').ilike('name', 'VIP team exclusive project').single();
  if (existing) {
    await supabase.from('products').update({ min: 30000, fixedDailyReturn: 300 }).eq('id', existing.id);
    console.log('Updated VIP team exclusive project');
  } else {
    console.log('Not found');
  }
}
run();
