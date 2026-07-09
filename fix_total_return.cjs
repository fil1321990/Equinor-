const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<div className="text-\[\#5B5FEF\] font-semibold text-\[15px\]">₦\{\(dailyIncome \* tPlusDays\)\.toLocaleString\(undefined, \{minimumFractionDigits: 0, maximumFractionDigits: 0\}\)\}<\/div>\s*<div className="text-\[\#5B5FEF\] text-\[12px\] whitespace-nowrap">Total return<\/div>/g,
  `<div className="text-[#5B5FEF] font-semibold text-[15px]">₦{(dailyIncome * (inv.total_duration_days || inv.days || Math.round((invEnd.getTime() - invStart.getTime()) / (1000 * 3600 * 24)))).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
      <div className="text-[#5B5FEF] text-[12px] whitespace-nowrap">Total return</div>`
);

fs.writeFileSync('src/App.tsx', code);
