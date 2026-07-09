const fs = require('fs');

// Fix store.tsx
let storeCode = fs.readFileSync('src/store.tsx', 'utf-8');
storeCode = storeCode.replace(
  /const createInvestment = async \([\s\S]*?quantity\?: number,\n  \) => \{/g,
  `const createInvestment = async (
    planName: string,
    amount: number,
    expectedRoi: number,
    durationDays: number,
    fixedDailyReturn?: number,
    tPlusDays?: number,
    quantity?: number,
    total_duration_days?: number,
    payout_cycle_days?: number
  ) => {`
);

storeCode = storeCode.replace(
  /const inv = \{\n      userId: currentUser\.id,\n      planName,\n      amount,\n      expectedRoi,\n      fixedDailyReturn,\n      tPlusDays: tPlusDays \|\| 1,\n      quantity: quantity \|\| 1,\n      startDate: new Date\(\)\.toISOString\(\),\n      endDate: new Date\(Date\.now\(\) \+ 86400000 \* durationDays\)\.toISOString\(\),\n      status: "active" as const,\n    \};/g,
  `const finalDuration = total_duration_days || durationDays || 30;
    const finalCycle = payout_cycle_days || tPlusDays || 1;
    const inv = {
      userId: currentUser.id,
      planName,
      amount,
      expectedRoi,
      fixedDailyReturn,
      tPlusDays: finalCycle,
      quantity: quantity || 1,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * finalDuration).toISOString(),
      status: "active" as const,
      total_duration_days: finalDuration,
      payout_cycle_days: finalCycle
    };`
);
fs.writeFileSync('src/store.tsx', storeCode);

// Fix App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace(
  /const res = await createInvestment\(planName, totalAmount, roi, days, fixedDailyReturn, tPlusDays, quantity\);/g,
  `const res = await createInvestment(planName, totalAmount, roi, days, fixedDailyReturn, tPlusDays, quantity, totalDurationDays, payoutCycleDays);`
);
fs.writeFileSync('src/App.tsx', appCode);
