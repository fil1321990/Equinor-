import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                  <button
                    className="bg-[#FF4FA3] text-white px-2 h-[32px] rounded-[16px] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center active:scale-95 transition-transform w-[120px] shadow-sm border-none z-10 relative"
                    onClick={() => setActiveModal("redemptionCode")}
                  >
                    Check presents
                  </button>"""

replacement = """                  <button
                    className="bg-[#FF4FA3] text-white px-2 h-[32px] rounded-[16px] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center active:scale-95 transition-transform w-[180px] shadow-sm border-none z-10 relative"
                    onClick={() => setActiveModal("redemptionCode")}
                  >
                    Check presents
                  </button>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced Check presents button")
else:
    print("Check presents button not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
