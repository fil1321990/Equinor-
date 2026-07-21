import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''    <div className="flex-1 flex justify-center items-center gap-1">
      {!canCollect && !isExpired ? (
        <>
          {daysLeft > 0 && (
            <div className="bg-black text-white rounded-[8px] px-3 h-[32px] flex items-center justify-center font-black text-[13px] min-w-[42px] shadow-sm tracking-wider">
              {daysLeft} Day
            </div>
          )}
          <div className="bg-black text-white rounded-[8px] w-[36px] h-[32px] flex items-center justify-center font-black text-[14px] shadow-sm tracking-wider">
            {hoursLeft.toString().padStart(2, '0')}
          </div>
          <span className="text-[#1A1A1A] font-black text-lg leading-none -mt-0.5">:</span>
          <div className="bg-black text-white rounded-[8px] w-[36px] h-[32px] flex items-center justify-center font-black text-[14px] shadow-sm tracking-wider">
            {minutesLeft.toString().padStart(2, '0')}
          </div>
          <span className="text-[#1A1A1A] font-black text-lg leading-none -mt-0.5">:</span>
          <div className="bg-black text-white rounded-[8px] w-[36px] h-[32px] flex items-center justify-center font-black text-[14px] shadow-sm tracking-wider">
            {secondsLeft.toString().padStart(2, '0')}
          </div>
        </>
      ) : (
        <div className="bg-black text-white rounded-[8px] px-4 h-[32px] flex items-center justify-center font-black text-[13px] shadow-sm tracking-wider">
          Ready
        </div>
      )}
    </div>'''

replacement = '''    <div className="flex-1 flex justify-center items-center gap-1">
      {!canCollect && !isExpired ? (
        <>
          {daysLeft > 0 && (
            <div className="text-[#1A1A1A] font-black text-[13px] mr-1">
              {daysLeft} Day
            </div>
          )}
          <div className="bg-black text-white rounded-[8px] w-[36px] h-[32px] flex items-center justify-center font-black text-[14px] shadow-sm tracking-wider">
            {hoursLeft.toString().padStart(2, '0')}
          </div>
          <span className="text-[#1A1A1A] font-black text-lg leading-none -mt-0.5">:</span>
          <div className="bg-black text-white rounded-[8px] w-[36px] h-[32px] flex items-center justify-center font-black text-[14px] shadow-sm tracking-wider">
            {minutesLeft.toString().padStart(2, '0')}
          </div>
          <span className="text-[#1A1A1A] font-black text-lg leading-none -mt-0.5">:</span>
          <div className="bg-black text-white rounded-[8px] w-[36px] h-[32px] flex items-center justify-center font-black text-[14px] shadow-sm tracking-wider">
            {secondsLeft.toString().padStart(2, '0')}
          </div>
        </>
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

