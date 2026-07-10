const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

code = code.replace(
  /maxQuota\?: number;/g,
  `maxQuota?: number;
  max_quota?: number;
  sold_count?: number;`
);

fs.writeFileSync('src/store.tsx', code);
