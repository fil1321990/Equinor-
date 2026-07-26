import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL.replace(/\/rest\/v1\/?$/, '');
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const { data, error } = await supabase.from('transactions').select('*').eq('id', '7b2f657d-66e4-4ea7-9c4d-e1884779b189').single();
console.log(JSON.stringify(data, null, 2));
