const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'setNewProductQuota(p.maxQuota?.toString() || "0");',
  'setNewProductQuota(p.maxQuota?.toString() || "0");\n                              setNewProductGlobalQuota(p.globalQuota?.toString() || "0");'
);

content = content.replace(
  'setNewProductQuota("0"); setNewProductGlobalQuota("0"); setNewProductGlobalQuota("0");',
  'setNewProductQuota("0"); setNewProductGlobalQuota("0");'
);

content = content.replaceAll(
  'setNewProductQuota("0");\n                        setNewProductType',
  'setNewProductQuota("0"); setNewProductGlobalQuota("0");\n                        setNewProductType'
);

content = content.replaceAll(
  'setNewProductQuota("0");\n                      setNewProductType',
  'setNewProductQuota("0"); setNewProductGlobalQuota("0");\n                      setNewProductType'
);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched missing admin fields');
