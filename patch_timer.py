import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''    <div className="flex-1 flex justify-center items-center">
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

replacement = '''    <div className="flex-1 flex justify-center items-center">
      {!canCollect && !isExpired ? (
        <div className="bg-black text-white rounded-[8px] px-3 h-[32px] flex items-center justify-center font-black text-[13px] shadow-sm tracking-wider">
          {daysLeft > 0 && <span className="mr-1.5">{daysLeft} Day :</span>}
          <span>{hoursLeft.toString().padStart(2, '0')}:{minutesLeft.toString().padStart(2, '0')}:{secondsLeft.toString().padStart(2, '0')}</span>
        </div>
      ) : (
        <div className="bg-black text-white rounded-[8px] px-4 h-[32px] flex items-center justify-center font-black text-[13px] shadow-sm tracking-wider">
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

