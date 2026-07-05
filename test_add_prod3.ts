import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const rawSupabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const product = {
    name: 'Test Prod',
    title: 'EQUINOR',
    roi: 12,
    min: 2000,
    days: 30,
    type: 'general',
    fixedDailyReturn: 0,
    imageUrl: '',
    tPlusDays: 1,
    maxQuota: 0,
    promotionalUnlockDate: null,
    promoClosingDate: null,
  };
  const { data, error } = await supabase.from('products').insert(product).select().single();
  console.log('Result:', data, error);
}
run();
