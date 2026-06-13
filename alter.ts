import { supabase } from './src/supabase';
async function run() {
  const { error } = await supabase.rpc('query', { 
    query_text: `CREATE TABLE IF NOT EXISTS chat_messages (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      "senderId" text,
      "receiverId" text,
      text text,
      timestamp timestamp with time zone,
      read boolean DEFAULT false
    );` 
  });
  console.log("Alter Error:", error);
}
run();
