const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf-8');

code = code.replace(/days: number;\n/g, 'days?: number;\n  total_duration_days?: number;\n  payout_cycle_days?: number;\n');
code = code.replace(/tPlusDays\?: number;\n/g, 'tPlusDays?: number;\n  payout_cycle_days?: number;\n  total_duration_days?: number;\n');

fs.writeFileSync('src/store.tsx', code);
