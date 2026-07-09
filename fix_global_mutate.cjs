const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

code = code.replace(/const globalMutate = async \(\) => \{/g, 'const globalMutate = async (args?: any) => {');

fs.writeFileSync('src/store.tsx', code);
