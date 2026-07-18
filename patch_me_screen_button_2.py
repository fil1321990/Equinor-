import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """              {/* Container for Layout */}
              <div className="mx-auto flex flex-col max-w-[400px] w-[calc(100%-2rem)] self-center">
                
                {/* Account balance card */}
                <div className="bg-[#FDD835] rounded-[16px] p-4 flex flex-col relative h-[95px] overflow-hidden shadow-sm">
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
                </div>
                
                {/* Spacing 16px gap with purple background */}
                <div className="h-4 w-full"></div>

                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-[24px] p-4 flex flex-col w-full shadow-lg">
                  
                  {/* Top: Promo Card */}
                  <div 
                    className="bg-gradient-to-r from-[#8630A1] to-[#4A22D4] rounded-[16px] p-[14px] flex flex-col items-center justify-center relative overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform gap-2"
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
                    <div className="text-[16px] font-black bg-gradient-to-r from-[#FDD835] via-[#FF4FA3] to-[#4AD2FF] text-transparent bg-clip-text leading-tight z-10 w-full relative text-center tracking-wide">
                      RESCUE PRESENTS
                    </div>
                    
                    <button
                      className="bg-[#FF4FA3] text-white px-4 h-[36px] rounded-[18px] text-[10px] font-bold uppercase tracking-wider flex items-center justify-center active:scale-95 transition-transform w-[300px] max-w-[95%] shadow-sm border-none z-10 relative text-center leading-tight"
                      onClick={() => setActiveModal("redemptionCode")}
                    >
                      Rescue presents of great value with a click
                    </button>

                    <div className="absolute right-4 bottom-1 w-[40px] h-[40px] flex items-center justify-center rotate-12 z-10 shrink-0 brightness-110 drop-shadow-xl">
                      <Gift className="w-[30px] h-[30px] text-[#FF4FA3]" strokeWidth={1.5} />
                    </div>
                  </div>"""

replacement = """              {/* Container for Layout */}
              <div className="mx-auto flex flex-col w-full px-4 self-center">
                
                {/* Account balance card */}
                <div className="bg-[#FDD835] rounded-[16px] p-4 flex flex-col relative h-[95px] overflow-hidden shadow-sm">
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
                </div>
                
                {/* Spacing 16px gap with purple background */}
                <div className="h-4 w-full"></div>

                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-[24px] p-4 flex flex-col w-full shadow-lg">
                  
                  {/* Top: Promo Card */}
                  <div 
                    className="bg-gradient-to-r from-[#8630A1] to-[#4A22D4] rounded-[16px] p-[14px] flex relative overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
                    
                    <div className="flex justify-between items-center w-full z-10 relative gap-2">
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="text-[16px] font-black bg-gradient-to-r from-[#FDD835] via-[#FF4FA3] to-[#4AD2FF] text-transparent bg-clip-text leading-tight w-full tracking-wide">
                          RESCUE PRESENTS
                        </div>
                        <button
                          className="bg-[#FF4FA3] text-white px-3 h-[30px] rounded-[15px] text-[8px] sm:text-[9px] font-bold uppercase tracking-wider flex items-center justify-center active:scale-95 transition-transform w-fit shadow-sm border-none text-left leading-[1.2]"
                          onClick={() => setActiveModal("redemptionCode")}
                        >
                          Rescue presents of great value with a click
                        </button>
                      </div>
                      
                      <div className="w-[45px] h-[45px] flex items-center justify-center rotate-12 shrink-0 brightness-110 drop-shadow-xl bg-white/10 rounded-full">
                        <Gift className="w-[28px] h-[28px] text-[#FF4FA3]" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced layout successfully")
else:
    print("Target layout not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
