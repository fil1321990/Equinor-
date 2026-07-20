import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                  {Array.from({ length: checkinCellCount }, (_, i) => {
                    const isPadding = i < firstDayWeekday;
                    const day = i - firstDayWeekday + 1;
                    if (isPadding) {
                      return <div key={`padding-${i}`} className="aspect-square bg-transparent border-none rounded-xl"></div>;
                    }
                    const checked = checkedDays.has(day);
                    const isBonusDay = [7, 15, 30].includes(day);
                    return (
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
                    );
                  })}"""

replacement = """                  {Array.from({ length: checkinCellCount }, (_, i) => {
                    const isPadding = i < firstDayWeekday;
                    const day = i - firstDayWeekday + 1;
                    if (isPadding) {
                      return <div key={`padding-${i}`} className="aspect-square bg-transparent border-none rounded-xl"></div>;
                    }
                    const checked = checkedDays.has(day);
                    const isBonusDay = [7, 15, 30].includes(day);
                    return (
                      <div key={day} className="aspect-square relative flex items-center justify-center">
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 border-[1.5px] rounded-lg relative flex flex-col items-center justify-center gap-1 ${checked ? "bg-white/10 border-[#FFC107]" : "bg-transparent border-transparent"}`}>
                          {isBonusDay && (
                            <div className="absolute -top-2 -right-2 bg-[#4ade80] text-[#0a0a1a] text-[9px] font-bold px-1 py-0.5 rounded-md leading-none shadow-sm z-10">
                              ₦{BONUSES[day as keyof typeof BONUSES]}
                            </div>
                          )}
                          {checked && (
                            <div className="w-3.5 h-3.5 bg-[#FFC107] rounded-full flex items-center justify-center shadow-sm shrink-0">
                              <Check className="text-[#0a0a1a] w-2.5 h-2.5 stroke-[4]" />
                            </div>
                          )}
                          <div className="text-[10px] sm:text-[12px] font-medium text-white leading-none">{MONTH_LABEL}.{day}</div>
                        </div>
                      </div>
                    );
                  })}"""

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)
