import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                  <button
                    onClick={() => setActiveModal("deposit")}
                    className="w-[60px] bg-[#1A1A1A] text-[#FFFFFF] h-[20px] rounded-[10px] text-[9px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                  >
                    Recharge
                  </button>
                  <button
                    onClick={() => setActiveModal("withdraw")}
                    className="w-[60px] bg-[#1A1A1A] text-[#FFFFFF] h-[20px] rounded-[10px] text-[9px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                  >
                    Withdraw
                  </button>"""

replacement = """                  <button
                    onClick={() => setActiveModal("deposit")}
                    className="w-[55px] bg-[#1A1A1A] text-[#FFFFFF] h-[26px] rounded-[13px] text-[9px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                  >
                    Recharge
                  </button>
                  <button
                    onClick={() => setActiveModal("withdraw")}
                    className="w-[55px] bg-[#1A1A1A] text-[#FFFFFF] h-[26px] rounded-[13px] text-[9px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                  >
                    Withdraw
                  </button>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced Recharge Buttons")
else:
    print("Recharge Buttons not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
