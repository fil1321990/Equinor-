import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => setActiveModal("deposit")}
                    className="flex-1 bg-[#1A1A1A] text-[#FFFFFF] h-[28px] rounded-[14px] text-[11px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                  >
                    Recharge
                  </button>
                  <button
                    onClick={() => setActiveModal("withdraw")}
                    className="flex-1 bg-[#1A1A1A] text-[#FFFFFF] h-[28px] rounded-[14px] text-[11px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                  >
                    Withdraw
                  </button>
                </div>"""

replacement = """                <div className="flex justify-start gap-3 w-full">
                  <button
                    onClick={() => setActiveModal("deposit")}
                    className="w-[100px] bg-[#1A1A1A] text-[#FFFFFF] h-[28px] rounded-[14px] text-[11px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                  >
                    Recharge
                  </button>
                  <button
                    onClick={() => setActiveModal("withdraw")}
                    className="w-[100px] bg-[#1A1A1A] text-[#FFFFFF] h-[28px] rounded-[14px] text-[11px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                  >
                    Withdraw
                  </button>
                </div>"""

if target in content:
    content = content.replace(target, replacement)
else:
    print("Not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Done")
