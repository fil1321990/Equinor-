const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const target = `                    const isPromoLocked = promoDiff > 0;
                    const planQuota = plan.max_quota || plan.maxQuota || 0;
                    const userBoughtCountForPlan = investments.filter(inv => inv.userId === currentUser?.id && inv.planName === plan.name && inv.status !== 'completed').reduce((sum, inv) => sum + (inv.quantity || 1), 0);
                    const isQuotaReached = planQuota > 0 && userBoughtCountForPlan >= planQuota;
                    
                    let buttonText = "Rush to buy";
                    if (isPromoLocked) buttonText = "Locked";
                    
                    const isButtonDisabled = isPromoLocked;`;
const replacement = `                    const isPromoLocked = promoDiff > 0;
                    const planQuota = plan.max_quota || plan.maxQuota || 0;
                    const globalQuota = plan.globalQuota || 0;
                    const soldCount = plan.sold_count || 0;
                    const userBoughtCountForPlan = investments.filter(inv => inv.userId === currentUser?.id && inv.planName === plan.name && inv.status !== 'completed').reduce((sum, inv) => sum + (inv.quantity || 1), 0);
                    const isQuotaReached = planQuota > 0 && userBoughtCountForPlan >= planQuota;
                    const isSoldOut = globalQuota > 0 && soldCount >= globalQuota;
                    
                    let buttonText = "Rush to buy";
                    if (isPromoLocked) buttonText = "Locked";
                    else if (isSoldOut) buttonText = "Sold Out";
                    
                    const isButtonDisabled = isPromoLocked || isSoldOut || (isQuotaReached && (buttonText="Quota Reached", true));`;
if (content.includes(target)) {
  fs.writeFileSync('src/App.tsx', content.replace(target, replacement));
  console.log('Patched src/App.tsx (buy button logic)');
} else {
  console.log('Target not found in src/App.tsx');
}
