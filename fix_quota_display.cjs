const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<span className="text-\[\#5B5FEF\]\/80 text-\[11px\]">Quota:<\/span>\s*<span className="text-\[\#5B5FEF\] font-black text-\[12px\] ml-1">\{plan\.maxQuota \|\| '∞'\}<\/span>/g,
  `{(() => {
    const userBoughtCount = investments.filter(inv => inv.userId === currentUser?.id && inv.planName === plan.name).reduce((sum, inv) => sum + (inv.quantity || 1), 0);
    return (
      <>
        <span className="text-[#5B5FEF]/80 text-[11px]">Quota:</span>
        <span className="text-[#5B5FEF] font-black text-[12px] ml-1">{plan.maxQuota ? \`\${userBoughtCount}/\${plan.maxQuota}\` : '∞'}</span>
      </>
    );
  })()}`
);

fs.writeFileSync('src/App.tsx', code);
