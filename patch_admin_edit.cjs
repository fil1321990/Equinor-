const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'maxQuota: Number(newProductQuota),\n                        type: newProductType,',
  'maxQuota: Number(newProductQuota),\n                        globalQuota: Number(newProductGlobalQuota),\n                        type: newProductType,'
);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched admin edit');
