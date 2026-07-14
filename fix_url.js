const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.split('url: referralLink;').join('url: referralLink');

fs.writeFileSync('src/App.tsx', code);
