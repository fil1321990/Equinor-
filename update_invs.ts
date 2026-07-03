import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = (process.env.VITE_SUPABASE_URL || '').replace('/rest/v1/', '');
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function update() {
  const { data, error } = await supabase
    .from('investments')
    .update({ planName: 'VIP Team Exclusive Project' })
    .eq('planName', 'VIP team exclusive project')
    .select();
  console.log("Investments:", data?.length, error);
}
update();
