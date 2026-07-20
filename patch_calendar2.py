import sys
import re

with open("src/App.tsx", "r") as f:
    content = f.read()

pattern = re.compile(
    r'(\{\s*Array\.from\(\{ length: checkinCellCount \}, \(_, i\) => \{.*?)'
    r'(const checked = checkedDays\.has\(day\);.*?)'
    r'(\}\)\s*\})', re.DOTALL
)

def repl(match):
    prefix = match.group(1)
    # We replace the inside
    inner = """const checked = checkedDays.has(day);
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
                            <div className="w-4 h-4 bg-[#FFC107] rounded-full flex items-center justify-center shadow-sm shrink-0">
                              <Check className="text-[#0a0a1a] w-3 h-3 stroke-[4]" />
                            </div>
                          )}
                          <div className="text-[10px] sm:text-[12px] font-medium text-white leading-none">{MONTH_LABEL}.{day}</div>
                        </div>
                      </div>
                    );
                  """
    suffix = match.group(3)
    return prefix + inner + suffix

new_content = pattern.sub(repl, content)

with open("src/App.tsx", "w") as f:
    f.write(new_content)
