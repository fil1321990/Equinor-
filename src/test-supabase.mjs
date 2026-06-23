import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = envFile.match(/VITE_SUPABASE_URL=(.*)/)?.[1];
const supabaseKey = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1];

fetch(`${supabaseUrl}/rest/v1/users?select=*&limit=1`, {
  headers: {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`
  }
}).then(res => res.json()).then(data => {
  console.log("Users schema:", Object.keys(data[0] || {}));
});
