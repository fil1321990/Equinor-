import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = (process.env.VITE_SUPABASE_URL || '').replace('/rest/v1/', '');
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('products').select('*').eq('name', 'VIP Team Exclusive Project');
  console.log("Select Data:", data);
}
test();
