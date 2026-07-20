import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''    <div className="flex-1 flex justify-center items-center gap-[2px]">
      {!canCollect && !isExpired ? (
        <>
          {daysLeft > 0 && (
            <div className="bg-[#10B981] text-white rounded-[4px] px-1.5 h-[28px] flex items-center justify-center text-[12px] font-bold">{daysLeft} Days</div>
          )}
          <div className="bg-[#10B981] text-white rounded-[4px] w-[26px] h-[28px] flex items-center justify-center text-[12px] font-bold">{hoursLeft.toString().padStart(2, '0')}</div>
          <div className="text-[#10B981] font-medium text-[10px] px-0.5">:</div>
          <div className="bg-[#10B981] text-white rounded-[4px] w-[26px] h-[28px] flex items-center justify-center text-[12px] font-bold">{minutesLeft.toString().padStart(2, '0')}</div>
          <div className="text-[#10B981] font-medium text-[10px] px-0.5">:</div>
          <div className="bg-[#10B981] text-white rounded-[4px] w-[26px] h-[28px] flex items-center justify-center text-[12px] font-bold">{secondsLeft.toString().padStart(2, '0')}</div>
        </>
      ) : (
        <span className="text-[#10B981] font-bold text-[12px]">Ready</span>
      )}
    </div>'''

replacement = '''    <div className="flex-1 flex justify-center items-center">
      {!canCollect && !isExpired ? (
        <div className="bg-[#10B981] text-white rounded-[6px] px-2 h-[28px] flex items-center justify-center text-[12px] font-bold tracking-wider shadow-sm border border-emerald-400">
          {daysLeft > 0 && <span className="mr-1">{daysLeft} Days</span>}
          <span>{hoursLeft.toString().padStart(2, '0')}:{minutesLeft.toString().padStart(2, '0')}:{secondsLeft.toString().padStart(2, '0')}</span>
        </div>
      ) : (
        <div className="bg-[#10B981] text-white rounded-[6px] px-3 h-[28px] flex items-center justify-center text-[12px] font-bold tracking-wider shadow-sm border border-emerald-400">
          Ready
        </div>
      )}
    </div>'''

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)

