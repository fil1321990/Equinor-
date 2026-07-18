const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const addRegex = /const success = await addProduct\(\{\n\s*name: newProductName,\n\s*title: JSON\.stringify\(\{ text: newProductTitle, color: newProductTitleColor, size: newProductTitleSize \}\),/g;
code = code.replace(addRegex, `const success = await addProduct({
                        name: newProductName,
                        title: JSON.stringify({ text: newProductTitle, color: newProductTitleColor, size: newProductTitleSize, audienceType: newProductAudienceType }),`);

const editRegex = /await editProduct\(editingProduct\.id, \{\n\s*name: newProductName,\n\s*title: JSON\.stringify\(\{ text: newProductTitle, color: newProductTitleColor, size: newProductTitleSize \}\),/g;
code = code.replace(editRegex, `await editProduct(editingProduct.id, {
                        name: newProductName,
                        title: JSON.stringify({ text: newProductTitle, color: newProductTitleColor, size: newProductTitleSize, audienceType: newProductAudienceType }),`);

code = code.replace(/\n\s*audienceType: newProductAudienceType,/g, '');

const helper = `const getAudienceType = (p: any) => {
  if (p.audienceType) return p.audienceType;
  if (p.type === 'redemption_code') return 'all';
  try {
    const parsed = JSON.parse(p.title || "{}");
    return parsed.audienceType || "all";
  } catch(e) {
    return "all";
  }
};`;

code = code.replace(/const getOffsetMs = \(timeObj: \{ d: string, h: string, m: string, s: string \}\) => \{/, helper + '\n\n  const getOffsetMs = (timeObj: { d: string, h: string, m: string, s: string }) => {');

code = code.replace(/\{p\.audienceType && p\.audienceType !== 'all'/g, `{getAudienceType(p) !== 'all'`);
code = code.replace(/uppercase">\{p\.audienceType\} Only/g, `uppercase">{getAudienceType(p)} Only`);
code = code.replace(/setNewProductAudienceType\(p\.audienceType \|\| "all"\);/g, `setNewProductAudienceType(getAudienceType(p));`);
code = code.replace(/equinorSelectedPlan\.audienceType/g, `getAudienceType(equinorSelectedPlan)`);

fs.writeFileSync('src/App.tsx', code);
