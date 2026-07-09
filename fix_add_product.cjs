const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /roi: Number\(newProductRoi\),/g,
  `roi: newProductFixedDaily ? (Number(newProductFixedDaily) * Number(newProductDays) / Number(newProductMin)) * 100 : Number(newProductRoi),`
);

code = code.replace(
  /roi: Number\(editProductRoi\),/g,
  `roi: editProductFixedDaily ? (Number(editProductFixedDaily) * Number(editProductDays) / Number(editProductMin)) * 100 : Number(editProductRoi),`
);

fs.writeFileSync('src/App.tsx', code);
