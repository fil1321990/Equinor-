import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''  {/* 3-up grid: daily income, cycle, total income */}
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

replacement = '''  {/* 3-up grid: daily income, cycle, total income */}
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

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
