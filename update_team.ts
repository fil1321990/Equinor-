import { supabase } from './src/supabase';
async function update() {
  const { data, error } = await supabase
    .from('products')
    .update({ min: 30000, days: 500, maxQuota: 1, roi: 1 })
    .eq('name', 'VIP team exclusive project')
    .select();
  console.log(data, error);
}
update();
