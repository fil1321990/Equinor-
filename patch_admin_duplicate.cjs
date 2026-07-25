const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'globalQuota: Number(newProductGlobalQuota),\n                        globalQuota: Number(newProductGlobalQuota),',
  'globalQuota: Number(newProductGlobalQuota),'
);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched duplicate globalQuota');
