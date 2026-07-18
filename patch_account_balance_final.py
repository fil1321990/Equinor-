import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                {/* Account balance card */}
                <div className="bg-[#FDD835] rounded-[32px] w-[90%] mx-auto p-4 px-6 flex flex-col relative h-[95px] overflow-hidden shadow-sm">
                  <div className="text-[13px] font-bold text-[#1A1A1A] leading-none mb-1">Account balance</div>
                  <div className="flex justify-end gap-2 w-full relative z-10">
                    <button
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
                    </button>
                  </div>
                  <div className="text-[18px] font-bold text-[#1A1A1A] leading-none mt-auto">
                    {formatCurrency(currentUser.balance)}
                  </div>
                </div>"""

replacement = """                {/* Account balance card */}
                <div className="bg-[#FDD835] rounded-[32px] w-full p-4 px-6 flex flex-col relative min-h-[85px] overflow-hidden shadow-sm justify-center">
                  <div className="text-[13px] font-bold text-[#1A1A1A] leading-none mb-1 opacity-80">Account balance</div>
                  <div className="flex justify-between items-end w-full relative z-10 mt-1">
                    <div className="text-[24px] font-black text-[#1A1A1A] leading-none tracking-tight">
                      {formatCurrency(currentUser.balance)}
                    </div>
                    <div className="flex gap-2 mb-1">
                      <button
                        onClick={() => setActiveModal("deposit")}
                        className="w-[55px] bg-[#1A1A1A] text-[#FFFFFF] h-[28px] rounded-[14px] text-[9px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                      >
                        Recharge
                      </button>
                      <button
                        onClick={() => setActiveModal("withdraw")}
                        className="w-[55px] bg-[#1A1A1A] text-[#FFFFFF] h-[28px] rounded-[14px] text-[9px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced account balance card successfully")
else:
    print("Target account balance card not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
