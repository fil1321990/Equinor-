import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''  </div>

  {/* 3. Title */}
  <div className="flex flex-col mb-2">'''

replacement = '''  </div>

  {/* 2. Top Row: Left "T+7" pill, Right: Duration Timer */}
  <div className="flex justify-between items-center mb-1">
    <div className="bg-[#FFE5E5] text-[#FF4444] px-2 py-0.5 rounded-[4px] text-[12px] font-medium">
      T+{inv.payout_cycle_days || inv.tPlusDays || 1}
    </div>
    <div className="flex justify-end">
      {!isExpired ? (
        <div className="flex items-center gap-1 text-[8px] font-bold text-[#1A1A1A]">
          {expYears > 0 && <span>{expYears}Y</span>}
          {Math.floor(expDays/30) > 0 && <span>{Math.floor(expDays/30)}M</span>}
          <span>{expDays%30}d</span>
          <span>{expHours.toString().padStart(2, '0')}h</span>
          <span>{expMinutes.toString().padStart(2, '0')}m</span>
          <span>{expSeconds.toString().padStart(2, '0')}s</span>
        </div>
      ) : (
        <div className="h-[15px]"></div>
      )}
    </div>
  </div>

  {/* 3. Title */}
  <div className="flex flex-col mb-2">'''

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
