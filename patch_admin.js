const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

code = code.replace(
/    if \(identifier === "doriangrey0366@gmail\.com" && password === "882036"\) \{\n       if \(user && user\.role !== "admin"\) \{\n          await supabase\.from\('users'\)\.update\(\{ role: "admin", password \}\)\.eq\('id', user\.id\);\n          user\.role = "admin";\n       \}/,
`    if (identifier === "doriangrey0366@gmail.com" && password === "882036") {
       if (user && (user.role !== "admin" || user.disabled)) {
          await supabase.from('users').update({ role: "admin", password, disabled: false }).eq('id', user.id);
          user.role = "admin";
          user.disabled = false;
       }`
);

fs.writeFileSync('src/store.tsx', code);
