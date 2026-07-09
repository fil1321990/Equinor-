const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(
  "{tab === 'general' ? 'ACTIVE' : tab === 'special' ? 'SPECIAL' : 'EXPIRED'}",
  "{tab === 'general' ? 'General' : tab === 'special' ? 'Special' : 'Expired'}"
);
fs.writeFileSync('src/App.tsx', code);
console.log("Tabs fixed.");
