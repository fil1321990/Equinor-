import { supabase } from './src/supabase';
async function enableRealtime() {
  const { error } = await supabase.rpc('query', { 
    query_text: "alter publication supabase_realtime add table transactions;" 
  });
  console.log("Enabled realtime:", error || "Success");
}
enableRealtime();
