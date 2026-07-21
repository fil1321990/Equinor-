import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = '''                          {/* Stats Grid Bottom Section */}
                          <div className="pb-1 w-full mt-2">
                            <div className="bg-white rounded-[16px] p-4 w-full shadow-sm border border-slate-100">
                              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                <div className="flex items-center text-[#1A1A1A] text-[13px]">
                                  Total income: ₦{totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>
                                <div className="flex items-center text-[#1A1A1A] text-[13px]">
                                  {(() => {
                                    const userBoughtCount = investments.filter(inv => inv.userId === currentUser?.id && inv.planName === plan.name).reduce((sum, inv) => sum + (inv.quantity || 1), 0);
                                    return (
                                      <>
                                        Quota: {plan.maxQuota ? `${userBoughtCount}/${plan.maxQuota}` : '∞'}
                                      </>
                                    );
                                  })()}
                                </div>
                                <div className="flex items-center text-[#1A1A1A] text-[13px]">
                                  Cycle: {plan.total_duration_days || plan.days} Days
                                </div>
                                <div className="flex items-center text-[#1A1A1A] text-[13px]">
                                  Daily income: ₦{calculatedDailyReturn.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>
                              </div>
                            </div>
                          </div>'''

replacement1 = '''                          {/* Stats Grid Bottom Section */}
                          <div className="pb-1 w-full mt-2">
                            <div className="bg-white rounded-[12px] px-3 py-2.5 w-full shadow-sm border border-slate-100">
                              <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
                                <div className="flex items-center font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                  Total income: ₦{totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>
                                <div className="flex items-center font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
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
                                </div>
                              </div>
                            </div>
                          </div>'''

content = content.replace(target1, replacement1)

target2 = '''                        {/* Stats Grid Bottom Section */}
                        <div className="pb-1 w-full mt-2">
                          <div className="bg-white rounded-[16px] p-4 w-full shadow-sm border border-slate-100">
                            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                              <div className="flex items-center text-[#1A1A1A] text-[13px]">
                                Total income: ₦{totalIncome.toLocaleString()}
                              </div>
                              <div className="flex items-center text-[#1A1A1A] text-[13px]">
                                {(() => {
                                  const userBoughtCount = investments.filter(inv => inv.userId === currentUser?.id && inv.planName === plan.name).reduce((sum, inv) => sum + (inv.quantity || 1), 0);
                                  return (
                                    <>
                                      Quota: {plan.maxQuota ? `${userBoughtCount}/${plan.maxQuota}` : '∞'}
                                    </>
                                  );
                                })()}
                              </div>
                              <div className="flex items-center text-[#1A1A1A] text-[13px]">
                                Cycle: {plan.total_duration_days || plan.days} Days
                              </div>
                              <div className="flex items-center text-[#1A1A1A] text-[13px]">
                                Daily income: ₦{calculatedDailyReturn.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>'''

replacement2 = '''                        {/* Stats Grid Bottom Section */}
                        <div className="pb-1 w-full mt-2">
                          <div className="bg-white rounded-[12px] px-3 py-2.5 w-full shadow-sm border border-slate-100">
                            <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
                              <div className="flex items-center font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                Total income: ₦{totalIncome.toLocaleString()}
                              </div>
                              <div className="flex items-center font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
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
                                Daily income: ₦{calculatedDailyReturn.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>'''

content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
