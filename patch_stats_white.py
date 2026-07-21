import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = '''                          {/* Stats Grid Bottom Section */}
                          <div className="pb-2 w-full">
                            <div className="bg-[#E8E9FF] rounded-[10px] py-2 w-full">
                              <div className="grid grid-cols-4 divide-x divide-[#5B5FEF]/20 w-full px-1">
                                <div className="flex flex-col items-center text-center px-1 overflow-hidden">
                                  <div className="text-[#5B5FEF] font-black text-[10px] sm:text-[11px] truncate w-full">₦{totalIncome.toLocaleString()}</div>
                                  <div className="text-[#5B5FEF]/80 text-[8px] sm:text-[9px] whitespace-nowrap">Total income</div>
                                </div>
                                <div className="flex flex-col items-center text-center px-1 overflow-hidden">
                                  {(() => {
                                    const userBoughtCount = investments.filter(inv => inv.userId === currentUser?.id && inv.planName === plan.name).reduce((sum, inv) => sum + (inv.quantity || 1), 0);
                                    return (
                                      <>
                                        <div className="text-[#5B5FEF] font-black text-[10px] sm:text-[11px] truncate w-full">{plan.maxQuota ? `${userBoughtCount}/${plan.maxQuota}` : '∞'}</div>
                                        <div className="text-[#5B5FEF]/80 text-[8px] sm:text-[9px] whitespace-nowrap">Quota</div>
                                      </>
                                    );
                                  })()}
                                </div>
                                <div className="flex flex-col items-center text-center px-1 overflow-hidden">
                                  <div className="text-[#5B5FEF] font-black text-[10px] sm:text-[11px] truncate w-full">{plan.total_duration_days || plan.days} Days</div>
                                  <div className="text-[#5B5FEF]/80 text-[8px] sm:text-[9px] whitespace-nowrap">Cycle</div>
                                </div>
                                <div className="flex flex-col items-center text-center px-1 overflow-hidden">
                                  <div className="text-[#5B5FEF] font-black text-[10px] sm:text-[11px] truncate w-full">₦{calculatedDailyReturn.toLocaleString()}</div>
                                  <div className="text-[#5B5FEF]/80 text-[8px] sm:text-[9px] whitespace-nowrap">Daily income</div>
                                </div>
                              </div>
                            </div>
                          </div>'''

replacement1 = '''                          {/* Stats Grid Bottom Section */}
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

target2 = '''                        {/* Stats Grid Bottom Section */}
                        <div className="pb-2 w-full">
                          <div className="bg-[#E8E9FF] rounded-[10px] py-2 w-full">
                            <div className="grid grid-cols-4 divide-x divide-[#5B5FEF]/20 w-full px-1">
                              <div className="flex flex-col items-center text-center px-1 overflow-hidden">
                                <div className="text-[#5B5FEF] font-black text-[10px] sm:text-[11px] truncate w-full">₦{totalIncome.toLocaleString()}</div>
                                <div className="text-[#5B5FEF]/80 text-[8px] sm:text-[9px] whitespace-nowrap">Total income</div>
                              </div>
                              <div className="flex flex-col items-center text-center px-1 overflow-hidden">
                                {(() => {
                                  const userBoughtCount = investments.filter(inv => inv.userId === currentUser?.id && inv.planName === plan.name).reduce((sum, inv) => sum + (inv.quantity || 1), 0);
                                  return (
                                    <>
                                      <div className="text-[#5B5FEF] font-black text-[10px] sm:text-[11px] truncate w-full">{plan.maxQuota ? `${userBoughtCount}/${plan.maxQuota}` : '∞'}</div>
                                      <div className="text-[#5B5FEF]/80 text-[8px] sm:text-[9px] whitespace-nowrap">Quota</div>
                                    </>
                                  );
                                })()}
                              </div>
                              <div className="flex flex-col items-center text-center px-1 overflow-hidden">
                                <div className="text-[#5B5FEF] font-black text-[10px] sm:text-[11px] truncate w-full">{plan.total_duration_days || plan.days} Days</div>
                                <div className="text-[#5B5FEF]/80 text-[8px] sm:text-[9px] whitespace-nowrap">Cycle</div>
                              </div>
                              <div className="flex flex-col items-center text-center px-1 overflow-hidden">
                                <div className="text-[#5B5FEF] font-black text-[10px] sm:text-[11px] truncate w-full">₦{calculatedDailyReturn.toLocaleString()}</div>
                                <div className="text-[#5B5FEF]/80 text-[8px] sm:text-[9px] whitespace-nowrap">Daily income</div>
                              </div>
                            </div>
                          </div>
                        </div>'''

replacement2 = '''                        {/* Stats Grid Bottom Section */}
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

content = content.replace(target1, replacement1)
content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
