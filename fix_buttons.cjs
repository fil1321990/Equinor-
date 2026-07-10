const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// First, inject our quota logic at the top of the map
const topTarget = `const promoDiff = plan.promotionalUnlockDate ? new Date(plan.promotionalUnlockDate).getTime() - Date.now() : 0;
                    const isPromoLocked = promoDiff > 0;`;

const topReplacement = `const promoDiff = plan.promotionalUnlockDate ? new Date(plan.promotionalUnlockDate).getTime() - Date.now() : 0;
                    const isPromoLocked = promoDiff > 0;
                    const planQuota = plan.max_quota || plan.maxQuota || 0;
                    const userBoughtCountForPlan = investments.filter(inv => inv.userId === currentUser?.id && inv.planName === plan.name && inv.status !== 'completed').reduce((sum, inv) => sum + (inv.quantity || 1), 0);
                    const isQuotaReached = planQuota > 0 && userBoughtCountForPlan >= planQuota;
                    const isSoldOut = planQuota > 0 && (plan.sold_count !== undefined && plan.sold_count >= planQuota);
                    let buttonText = "Rush to buy";
                    if (isPromoLocked) buttonText = "Locked";
                    else if (isSoldOut) buttonText = "Sold Out";
                    else if (isQuotaReached) buttonText = "Quota Reached";
                    const isButtonDisabled = isPromoLocked || isQuotaReached || isSoldOut;`;
code = code.replace(topTarget, topReplacement);

// Fix button 1
code = code.replace(
  `className={isPromoLocked ? "bg-slate-300 text-slate-500 px-6 py-2.5 rounded-[20px] font-bold text-[14px] cursor-not-allowed transform transition" : "bg-[#7B2FF7] text-white px-6 py-2.5 rounded-[20px] font-bold text-[14px] shadow-sm transform transition active:scale-95"}
                            >
                              {isPromoLocked ? "Locked" : "Rush to buy"}`
  ,
  `className={isButtonDisabled ? "bg-slate-300 text-slate-500 px-6 py-2.5 rounded-[20px] font-bold text-[14px] cursor-not-allowed transform transition" : "bg-[#7B2FF7] text-white px-6 py-2.5 rounded-[20px] font-bold text-[14px] shadow-sm transform transition active:scale-95"}
                            >
                              {buttonText}`
);

// Fix button 2
code = code.replace(
  `className={isPromoLocked ? "bg-slate-300 text-slate-500 px-6 py-2.5 rounded-[20px] font-bold text-[14px] cursor-not-allowed transform transition shrink-0 mt-1" : "bg-[#7B2FF7] text-white px-6 py-2.5 rounded-[20px] font-bold text-[14px] shadow-sm transform transition active:scale-95 shrink-0 mt-1"}
                            >
                              {isPromoLocked ? "Locked" : "Rush to buy"}`
  ,
  `className={isButtonDisabled ? "bg-slate-300 text-slate-500 px-6 py-2.5 rounded-[20px] font-bold text-[14px] cursor-not-allowed transform transition shrink-0 mt-1" : "bg-[#7B2FF7] text-white px-6 py-2.5 rounded-[20px] font-bold text-[14px] shadow-sm transform transition active:scale-95 shrink-0 mt-1"}
                            >
                              {buttonText}`
);

// Fix button 3
code = code.replace(
  `className={isPromoLocked ? "bg-slate-300 text-slate-500 px-6 py-2.5 rounded-[20px] font-black text-[14px] cursor-not-allowed transform transition" : "bg-[#7B2FF7] text-white px-6 py-2.5 rounded-[20px] font-black text-[14px] shadow-sm transform transition active:scale-95"}
                          >
                            {isPromoLocked ? "Locked" : "Rush to buy"}`
  ,
  `className={isButtonDisabled ? "bg-slate-300 text-slate-500 px-6 py-2.5 rounded-[20px] font-black text-[14px] cursor-not-allowed transform transition" : "bg-[#7B2FF7] text-white px-6 py-2.5 rounded-[20px] font-black text-[14px] shadow-sm transform transition active:scale-95"}
                          >
                            {buttonText}`
);

fs.writeFileSync('src/App.tsx', code);
