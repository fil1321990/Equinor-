import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL!.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''), process.env.VITE_SUPABASE_ANON_KEY!);

async function run() {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    console.log("Data:", data ? Object.keys(data[0]) : null);
}
run();
