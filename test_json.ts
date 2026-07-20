import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabase = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY!);

async function run() {
  const { data, error } = await supabase.from('app_settings').update({ adminWhatsApp: JSON.stringify({ whatsapp: true, inApp: true }) }).eq('id', 1).select();
  console.log('Error:', error);
  console.log('Data:', data);
}
run();
