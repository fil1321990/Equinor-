const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(
  'onClick={() => {\n                  if (!registerForm.agreed) {',
  'onClick={async () => {\n                  if (!registerForm.agreed) {'
);
fs.writeFileSync('src/App.tsx', code);
