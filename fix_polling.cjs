const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf-8');

// Remove the setInterval
code = code.replace(
  /\/\/ Poll every 5 seconds to keep devices in sync\n    const interval = setInterval\(\(\) => {\n      fetchData\(\);\n    }, 5000\);/g,
  `// Use Supabase realtime instead of aggressive polling`
);

// Add missing tables to realtime
code = code.replace(
  /\.on\('postgres_changes', { event: '\*', schema: 'public', table: 'transactions' }, \(payload\) => {\n         fetchData\(\);\n      }\)/g,
  `.on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => { fetchData(); })\n      .on('postgres_changes', { event: '*', schema: 'public', table: 'investments' }, () => { fetchData(); })\n      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => { fetchData(); })`
);

code = code.replace(/clearInterval\(interval\);\n/g, '');

fs.writeFileSync('src/store.tsx', code);
console.log("Polling removed and realtime extended.");
