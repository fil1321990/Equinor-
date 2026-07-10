const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/if \(isPromoLocked\) return;/g, 'if (isButtonDisabled) return;');

fs.writeFileSync('src/App.tsx', code);
