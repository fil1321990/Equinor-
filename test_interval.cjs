const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf-8');
console.log(code.includes("setInterval(() => {"));
