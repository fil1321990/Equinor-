import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = '''                                <div className="flex items-center font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                  {(() => {
                                    const userBoughtCount = investments.filter(inv => inv.userId === currentUser?.id && inv.planName === plan.name).reduce((sum, inv) => sum + (inv.quantity || 1), 0);
                                    return (
                                      <>
                                        Quota: {plan.maxQuota ? `${userBoughtCount}/${plan.maxQuota}` : '∞'}
                                      </>
                                    );
                                  })()}
                                </div>
                                <div className="flex items-center font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                  Cycle: {plan.total_duration_days || plan.days} Days
                                </div>
                                <div className="flex items-center font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                  Daily income: ₦{calculatedDailyReturn.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>'''

replacement1 = '''                                <div className="flex items-center justify-end font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                  {(() => {
                                    const userBoughtCount = investments.filter(inv => inv.userId === currentUser?.id && inv.planName === plan.name).reduce((sum, inv) => sum + (inv.quantity || 1), 0);
                                    return (
                                      <>
                                        Quota: {plan.maxQuota ? `${userBoughtCount}/${plan.maxQuota}` : '∞'}
                                      </>
                                    );
                                  })()}
                                </div>
                                <div className="flex items-center font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                  Cycle: {plan.total_duration_days || plan.days} Days
                                </div>
                                <div className="flex items-center justify-center font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                  Daily income: ₦{calculatedDailyReturn.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>'''

content = content.replace(target1, replacement1)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
