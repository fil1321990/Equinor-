const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
if(!supabaseUrl) { console.log("NO URL"); process.exit(1); }
const supabase = createClient(supabaseUrl, supabaseKey);
async function run() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  console.log(data, error);
}
run();
