import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                <div className="px-4 w-full">
                  {/* Account balance card */}
                  <div className="bg-[#FDD835] rounded-[32px] w-full p-4 px-6 flex relative min-h-[85px] overflow-hidden shadow-sm items-center justify-between">
                    <div className="flex flex-col relative z-10">
                      <div className="text-[13px] font-bold text-[#1A1A1A] leading-none mb-1 opacity-80">Account balance</div>
                      <div className="text-[18px] font-black text-[#1A1A1A] leading-none tracking-tight">
                        {formatCurrency(currentUser.balance)}
                      </div>
                    </div>
                    <div className="flex gap-2 relative z-10">
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

replacement = """                <div className="px-4 w-full">
                  {/* Account balance card */}
                  <div className="bg-[#FDD835] rounded-[32px] w-full py-3 px-6 flex flex-col relative h-[65px] justify-between overflow-hidden shadow-sm">
                    {/* Top Row: Account balance label */}
                    <div className="flex w-full justify-start relative z-10">
                      <div className="text-[10px] font-bold text-[#1A1A1A] leading-none opacity-80">Account balance</div>
                    </div>
                    
                    {/* Bottom Row: Balance */}
                    <div className="flex w-full justify-start relative z-10">
                      <div className="text-[14px] font-black text-[#1A1A1A] leading-none tracking-tight">
                        {formatCurrency(currentUser.balance)}
                      </div>
                    </div>

                    {/* Middle Right: Buttons */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2 z-10">
                      <button
                        onClick={() => setActiveModal("deposit")}
                        className="w-[55px] bg-[#1A1A1A] text-[#FFFFFF] h-[26px] rounded-[13px] text-[8.5px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                      >
                        Recharge
                      </button>
                      <button
                        onClick={() => setActiveModal("withdraw")}
                        className="w-[55px] bg-[#1A1A1A] text-[#FFFFFF] h-[26px] rounded-[13px] text-[8.5px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced account balance successfully")
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
