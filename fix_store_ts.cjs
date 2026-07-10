const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

code = code.replace(
  /if \(window\.dbFetchTimeout\) clearTimeout\(window\.dbFetchTimeout\);\n\s*window\.dbFetchTimeout = setTimeout\(fetch, 500\);/g,
  `if ((window as any).dbFetchTimeout) clearTimeout((window as any).dbFetchTimeout);
        (window as any).dbFetchTimeout = setTimeout(fetch, 500);`
);

fs.writeFileSync('src/store.tsx', code);
