const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  `    createInvestment(planName, totalAmount, roi, days, fixedDailyReturn, tPlusDays, quantity);\n    triggerVisualNotification("purchase_success", "PURCHASE SUCCESSFUL", "Thank you for choosing Equinor", totalAmount);`,
  `    const res = await createInvestment(planName, totalAmount, roi, days, fixedDailyReturn, tPlusDays, quantity);\n    if (res && res.success) {\n      triggerVisualNotification("purchase_success", "PURCHASE SUCCESSFUL", "Thank you for choosing Equinor", totalAmount);\n    }`
);

fs.writeFileSync('src/App.tsx', code);
console.log("buyProduct fixed.");
