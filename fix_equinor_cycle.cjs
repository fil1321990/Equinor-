const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  /equinorSelectedPlan\.days\} Days/g,
  'equinorSelectedPlan.total_duration_days || equinorSelectedPlan.days} Days'
);

fs.writeFileSync('src/App.tsx', code);
