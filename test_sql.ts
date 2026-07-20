import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL!.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''), process.env.VITE_SUPABASE_ANON_KEY!);

async function run() {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: 'ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS "read" boolean DEFAULT false;' });
    console.log("Error:", error);
}
run();
