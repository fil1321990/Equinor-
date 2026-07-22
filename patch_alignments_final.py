import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Revert order card 3-up grid
target_order = '''  {/* 3-up grid: daily income, cycle, total income */}
  <div className="bg-[#E8E9FF] rounded-[10px] py-1.5 w-full mb-1">
    <div className="grid grid-cols-3 divide-x divide-[#5B5FEF]/20 w-full px-1">
      <div className="flex flex-col items-start text-left px-1 overflow-hidden">
        <div className="text-[#5B5FEF] font-semibold text-[11px] sm:text-[12px] truncate w-full text-left">₦{dailyIncome.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
        <div className="text-[#5B5FEF] text-[9px] sm:text-[10px] whitespace-nowrap">Daily income</div>
      </div>
      <div className="flex flex-col items-center text-center px-1 overflow-hidden">
        <div className="text-[#5B5FEF] font-semibold text-[11px] sm:text-[12px] truncate w-full text-center">₦{(dailyIncome * (inv.total_duration_days || inv.days || Math.round((invEnd.getTime() - invStart.getTime()) / (1000 * 3600 * 24)))).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
        <div className="text-[#5B5FEF] text-[9px] sm:text-[10px] whitespace-nowrap">Total income</div>
      </div>
      <div className="flex flex-col items-end text-right px-1 overflow-hidden">
        <div className="text-[#5B5FEF] font-semibold text-[11px] sm:text-[12px] truncate w-full text-right">{inv.total_duration_days || inv.days || Math.round((invEnd.getTime() - invStart.getTime()) / (1000 * 3600 * 24))} D</div>
        <div className="text-[#5B5FEF] text-[9px] sm:text-[10px] whitespace-nowrap">Cycle</div>
      </div>
    </div>
  </div>'''

replacement_order = '''  {/* 3-up grid: daily income, cycle, total income */}
  <div className="bg-[#E8E9FF] rounded-[10px] py-1.5 w-full mb-1">
    <div className="grid grid-cols-3 divide-x divide-[#5B5FEF]/20 w-full px-1">
      <div className="flex flex-col items-center text-center px-1 overflow-hidden">
        <div className="text-[#5B5FEF] font-semibold text-[11px] sm:text-[12px] truncate w-full">₦{dailyIncome.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
        <div className="text-[#5B5FEF] text-[9px] sm:text-[10px] whitespace-nowrap">Daily income</div>
      </div>
      <div className="flex flex-col items-center text-center px-1 overflow-hidden">
        <div className="text-[#5B5FEF] font-semibold text-[11px] sm:text-[12px] truncate w-full">{inv.total_duration_days || inv.days || Math.round((invEnd.getTime() - invStart.getTime()) / (1000 * 3600 * 24))} D</div>
        <div className="text-[#5B5FEF] text-[9px] sm:text-[10px] whitespace-nowrap">Cycle</div>
      </div>
      <div className="flex flex-col items-center text-center px-1 overflow-hidden">
        <div className="text-[#5B5FEF] font-semibold text-[11px] sm:text-[12px] truncate w-full">₦{(dailyIncome * (inv.total_duration_days || inv.days || Math.round((invEnd.getTime() - invStart.getTime()) / (1000 * 3600 * 24)))).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
        <div className="text-[#5B5FEF] text-[9px] sm:text-[10px] whitespace-nowrap">Total income</div>
      </div>
    </div>
  </div>'''

content = content.replace(target_order, replacement_order)

# 2. Update product tab stats grid
target_product1 = '''                                <div className="flex items-center font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                  Cycle: {plan.total_duration_days || plan.days} Days
                                </div>
                                <div className="flex items-center justify-center font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                  Daily income: ₦{calculatedDailyReturn.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>'''

replacement_product1 = '''                                <div className="flex items-center justify-start font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                  Daily income: ₦{calculatedDailyReturn.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>
                                <div className="flex items-center justify-end font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                  Cycle: {plan.total_duration_days || plan.days} Days
                                </div>'''

content = content.replace(target_product1, replacement_product1)


target_product2 = '''                              <div className="flex items-center font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                Cycle: {plan.total_duration_days || plan.days} Days
                              </div>
                              <div className="flex items-center justify-center font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                Daily income: ₦{calculatedDailyReturn.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                              </div>'''

replacement_product2 = '''                              <div className="flex items-center justify-start font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                Daily income: ₦{calculatedDailyReturn.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                              </div>
                              <div className="flex items-center justify-end font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                Cycle: {plan.total_duration_days || plan.days} Days
                              </div>'''

content = content.replace(target_product2, replacement_product2)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
