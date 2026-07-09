const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  /Equinor Equity Exchange Project/g,
  'EQ Equity exchange project'
);
code = code.replace(
  /equinor equity exchange project/g,
  'eq equity exchange project'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Equity name fixed.");
