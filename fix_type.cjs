const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf-8');
code = code.replace(
  'createInvestment: (\n    planName: string,\n    amount: number,\n    expectedRoi: number,\n    durationDays: number,\n    fixedDailyReturn?: number,\n    tPlusDays?: number,\n    quantity?: number,\n  ) => void;',
  'createInvestment: (\n    planName: string,\n    amount: number,\n    expectedRoi: number,\n    durationDays: number,\n    fixedDailyReturn?: number,\n    tPlusDays?: number,\n    quantity?: number,\n  ) => Promise<{ success: boolean; message?: string } | undefined>;'
);
fs.writeFileSync('src/store.tsx', code);
console.log("Type fixed.");
