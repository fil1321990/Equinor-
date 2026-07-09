const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  /<span className="text-\[#5B5FEF\] font-medium text-\[12px\] ml-1">1 Days<\/span>/g,
  '<span className="text-[#5B5FEF] font-medium text-[12px] ml-1">{plan.total_duration_days || plan.days} Days</span>'
);

fs.writeFileSync('src/App.tsx', code);
