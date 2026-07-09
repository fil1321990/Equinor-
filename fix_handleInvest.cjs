const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /await handleInvest\(equinorSelectedPlan\.name, equinorSelectedPlan\.buyAmount, equinorSelectedPlan\.calculatedRoi, equinorSelectedPlan\.days \|\| 30, equinorSelectedPlan\.type, equinorSelectedPlan\.fixedDailyReturn, equinorSelectedPlan\.tPlusDays, Number\(buyingQuantity\), equinorSelectedPlan\.total_duration_days \|\| equinorSelectedPlan\.days \|\| 30, equinorSelectedPlan\.payout_cycle_days \|\| equinorSelectedPlan\.tPlusDays \|\| 1\);/,
  `await handleInvest(equinorSelectedPlan.name, equinorSelectedPlan.buyAmount, equinorSelectedPlan.roi, equinorSelectedPlan.days || 30, equinorSelectedPlan.type, equinorSelectedPlan.fixedDailyReturn, equinorSelectedPlan.tPlusDays, Number(buyingQuantity), equinorSelectedPlan.total_duration_days || equinorSelectedPlan.days || 30, equinorSelectedPlan.payout_cycle_days || equinorSelectedPlan.tPlusDays || 1);`
);

fs.writeFileSync('src/App.tsx', code);
