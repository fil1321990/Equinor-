const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /roi: newProductFixedDaily \? \(Number\(newProductFixedDaily\) \* Number\(newProductDays\) \/ Number\(newProductMin\)\) \* 100 : Number\(newProductRoi\),/g,
  'roi: newProductFixedDaily ? (((Number(newProductFixedDaily) * Number(newProductDays)) - Number(newProductMin)) / Number(newProductMin)) * 100 : Number(newProductRoi),'
);

fs.writeFileSync('src/App.tsx', code);
