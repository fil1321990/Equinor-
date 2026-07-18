import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """            <div className="flex-1 w-full relative flex flex-col pt-0">
              {/* Daily Service */}
              <div className="bg-[#7b5cff] pt-5 px-4 pb-[30px] w-full flex-shrink-0">
                <div className="text-center text-[16px] font-medium mb-1">Daily service</div>
                <div className="text-center text-[18px] font-bold text-[#ffd24d] mb-1">Continuous sign-in {continuousStreak}</div>
                {/* Weekdays */}
                <div className="grid grid-cols-7 mb-3">"""

replacement = """            <div className="flex-1 w-full relative flex flex-col pt-0">
              {/* Daily Service */}
              <div className="bg-[#1A237E] pt-5 px-4 pb-[30px] w-full flex-shrink-0">
                <div className="text-center text-[16px] font-medium mb-1">Daily service</div>
                <div className="text-center text-[18px] font-bold text-[#FFB300] mb-1">Continuous sign-in {continuousStreak}</div>
                {/* Weekdays */}
                <div className="grid grid-cols-7 mb-3">"""

content = content.replace(target, replacement)


target2 = """                    return (
                      <div key={day} className={`aspect-square border rounded-xl relative flex items-end justify-center pb-1.5 ${checked ? "bg-[#a88cff] border-white" : "bg-[#a88cff]/50 border-white/40"}`}>
                        {isBonusDay && (
                          <div className="absolute -top-1.5 -right-1.5 bg-[#4ade80] text-[#0a0a1a] text-[9px] font-bold px-1 py-0.5 rounded-md leading-none shadow-sm">
                            ₦{BONUSES[day as keyof typeof BONUSES]}
                          </div>
                        )}
                        {checked && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#ffd24d] rounded-full pointer-events-none flex items-center justify-center shadow-sm">
                            <Check className="text-[#0a0a1a] w-3.5 h-3.5 stroke-[4]" />
                          </div>
                        )}
                        <div className="text-[12px] font-medium text-white">{MONTH_LABEL}.{day}</div>
                      </div>
                    );"""

replacement2 = """                    return (
                      <div key={day} className={`aspect-square border-[1.5px] rounded-xl relative flex flex-col items-center justify-center gap-1 ${checked ? "bg-white/10 border-[#FFB300]" : "bg-white/5 border-white/40"}`}>
                        {isBonusDay && (
                          <div className="absolute -top-2 -right-2 bg-[#4ade80] text-[#0a0a1a] text-[9px] font-bold px-1 py-0.5 rounded-md leading-none shadow-sm z-10">
                            ₦{BONUSES[day as keyof typeof BONUSES]}
                          </div>
                        )}
                        {checked ? (
                          <div className="w-5 h-5 bg-[#FFB300] rounded-full flex items-center justify-center shadow-sm shrink-0">
                            <Check className="text-[#0a0a1a] w-3.5 h-3.5 stroke-[4]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 shrink-0" />
                        )}
                        <div className="text-[10px] sm:text-[12px] font-medium text-white leading-none">{MONTH_LABEL}.{day}</div>
                      </div>
                    );"""

content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Done")
