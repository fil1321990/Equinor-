import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target2 = '''                        {/* Stats Grid Bottom Section */}
                        <div className="pb-2">
                          <div className="flex flex-wrap gap-2">
                            <div className="flex items-center whitespace-nowrap bg-[#E8E9FF] px-2 py-1 rounded-[8px] text-[#5B5FEF]">
                              <span className="text-[#5B5FEF]/80 text-[11px]">Total income:</span>
                              <span className="text-[#5B5FEF] font-black text-[12px] ml-1">₦{totalIncome.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center whitespace-nowrap bg-[#E8E9FF] px-2 py-1 rounded-[8px] text-[#5B5FEF]">
                              {(() => {
    const userBoughtCount = investments.filter(inv => inv.userId === currentUser?.id && inv.planName === plan.name).reduce((sum, inv) => sum + (inv.quantity || 1), 0);
    return (
      <>
        <span className="text-[#5B5FEF]/80 text-[11px]">Quota:</span>
        <span className="text-[#5B5FEF] font-black text-[12px] ml-1">{plan.maxQuota ? `${userBoughtCount}/${plan.maxQuota}` : '∞'}</span>
      </>
    );
  })()}
                            </div>
                            <div className="flex items-center whitespace-nowrap bg-[#E8E9FF] px-2 py-1 rounded-[8px] text-[#5B5FEF]">
                              <span className="text-[#5B5FEF]/80 text-[11px]">Cycle:</span>
                              <span className="text-[#5B5FEF] font-black text-[12px] ml-1">{plan.total_duration_days || plan.days} Days</span>
                            </div>
                            <div className="flex items-center whitespace-nowrap bg-[#E8E9FF] px-2 py-1 rounded-[8px] text-[#5B5FEF]">
                              <span className="text-[#5B5FEF]/80 text-[11px]">Daily income:</span>
                              <span className="text-[#5B5FEF] font-black text-[12px] ml-1">₦{calculatedDailyReturn.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>'''

replacement2 = '''                        {/* Stats Grid Bottom Section */}
                        <div className="pb-2 w-full">
                          <div className="grid grid-cols-4 gap-1 w-full">
                            <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-1 flex flex-col items-center justify-center text-center overflow-hidden">
                              <div className="text-[#5B5FEF] font-black text-[11px] truncate w-full">₦{totalIncome.toLocaleString()}</div>
                              <div className="text-[#5B5FEF]/80 text-[9px] sm:text-[10px] whitespace-nowrap">Total income</div>
                            </div>
                            <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-1 flex flex-col items-center justify-center text-center overflow-hidden">
                              {(() => {
                                const userBoughtCount = investments.filter(inv => inv.userId === currentUser?.id && inv.planName === plan.name).reduce((sum, inv) => sum + (inv.quantity || 1), 0);
                                return (
                                  <>
                                    <div className="text-[#5B5FEF] font-black text-[11px] truncate w-full">{plan.maxQuota ? `${userBoughtCount}/${plan.maxQuota}` : '∞'}</div>
                                    <div className="text-[#5B5FEF]/80 text-[9px] sm:text-[10px] whitespace-nowrap">Quota</div>
                                  </>
                                );
                              })()}
                            </div>
                            <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-1 flex flex-col items-center justify-center text-center overflow-hidden">
                              <div className="text-[#5B5FEF] font-black text-[11px] truncate w-full">{plan.total_duration_days || plan.days} Days</div>
                              <div className="text-[#5B5FEF]/80 text-[9px] sm:text-[10px] whitespace-nowrap">Cycle</div>
                            </div>
                            <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-1 flex flex-col items-center justify-center text-center overflow-hidden">
                              <div className="text-[#5B5FEF] font-black text-[11px] truncate w-full">₦{calculatedDailyReturn.toLocaleString()}</div>
                              <div className="text-[#5B5FEF]/80 text-[9px] sm:text-[10px] whitespace-nowrap">Daily income</div>
                            </div>
                          </div>
                        </div>'''

content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
