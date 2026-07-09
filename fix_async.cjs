const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(
  'const handleInvest = (',
  'const handleInvest = async ('
);
fs.writeFileSync('src/App.tsx', code);
