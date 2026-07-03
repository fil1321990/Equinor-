import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = (process.env.VITE_SUPABASE_URL || '').replace('/rest/v1/', '');
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function update() {
  const { data, error } = await supabase
    .from('products')
    .update({ name: 'VIP Team Exclusive Project' })
    .eq('name', 'VIP team exclusive project')
    .select();
  console.log(data, error);
}
update();
