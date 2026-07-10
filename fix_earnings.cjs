const fs = require('fs');
let code = fs.readFileSync('src/lib/earnings.ts', 'utf8');

code = code.replace(
  /\(Number\(investment\.amount \|\| 0\) \* \(Number\(investment\.expectedRoi \|\| 0\) \/ 100\)\) \/ \(investment\.total_duration_days \|\| 1\)/g,
  '(Number(investment.amount || 0) * (1 + Number(investment.expectedRoi || 0) / 100)) / (investment.total_duration_days || 1)'
);

// Also fix for subordinate subInv
code = code.replace(
  /\(subInv\.amount \|\| 0\) \* \(\(subInv\.expectedRoi \|\| 0\) \/ 100\)/g,
  '(subInv.amount || 0) * (1 + (subInv.expectedRoi || 0) / 100)'
);

fs.writeFileSync('src/lib/earnings.ts', code);
