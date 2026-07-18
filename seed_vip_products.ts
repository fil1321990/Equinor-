import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const rawSupabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const products = [
    {
      name: 'EQ Equity exchange project',
      title: 'EQUINOR',
      roi: 0,
      min: 0,
      days: 1,
      type: 'vip',
      tPlusDays: 1,
      maxQuota: 1,
    },
    {
      name: 'VIP member exclusive project',
      title: 'EQUINOR',
      roi: 0,
      min: 0,
      days: 500,
      type: 'vip',
      tPlusDays: 1,
      maxQuota: 1,
    },
    {
      name: 'VIP team exclusive project',
      title: 'EQUINOR',
      roi: 0,
      min: 0,
      days: 500,
      type: 'vip',
      tPlusDays: 1,
      maxQuota: 1,
    }
  ];

  for (const prod of products) {
    const { data: existing } = await supabase.from('products').select('*').ilike('name', prod.name).single();
    if (!existing) {
      await supabase.from('products').insert(prod);
      console.log('Inserted', prod.name);
    } else {
      await supabase.from('products').update({ type: 'vip' }).eq('id', existing.id);
      console.log('Updated', prod.name, 'to type vip');
    }
  }
}

run();
