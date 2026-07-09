const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  /\{plan\.cycle \|\| plan\.days\} Days/g,
  '{plan.total_duration_days || plan.days} Days'
);

code = code.replace(
  /<div className="text-\[#5B5FEF\] font-semibold text-\[15px\]">\{tPlusDays\} d<\/div>\n      <div className="text-\[#5B5FEF\] text-\[12px\] whitespace-nowrap">Cycle<\/div>/g,
  `<div className="text-[#5B5FEF] font-semibold text-[15px]">{inv.total_duration_days || inv.days || Math.round((invEnd.getTime() - invStart.getTime()) / (1000 * 3600 * 24))} Days</div>
      <div className="text-[#5B5FEF] text-[12px] whitespace-nowrap">Cycle</div>`
);

// We also need to add "Collection In" countdown.
// Wait, is there already a countdown? Let's check around line 3280.
fs.writeFileSync('src/App.tsx', code);
