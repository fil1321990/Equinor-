const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /\{plan\.maxQuota \? <span className="text-\[\#0052FF\] text-\[9px\] font-bold tracking-wider bg-blue-50 px-1\.5 py-0\.5 rounded uppercase">Quota: \{plan\.maxQuota\}<\/span> : null\}/g,
  `{plan.maxQuota ? <span className="text-[#0052FF] text-[9px] font-bold tracking-wider bg-blue-50 px-1.5 py-0.5 rounded uppercase">Quota: {investments.filter(inv => inv.userId === currentUser?.id && inv.planName === plan.name).reduce((sum, inv) => sum + (inv.quantity || 1), 0)}/{plan.maxQuota}</span> : null}`
);

fs.writeFileSync('src/App.tsx', code);
