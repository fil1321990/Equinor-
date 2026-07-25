import { supabase } from './src/supabase';
async function run() {
  const { error, data } = await supabase.rpc('query', { 
    query_text: `ALTER TABLE products ADD COLUMN "countsForVip" boolean DEFAULT true;`
   });
  console.log("Alter Error:", error, data);
}
run();
