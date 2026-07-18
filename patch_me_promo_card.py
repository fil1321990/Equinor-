import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                  {/* Top: Promo Card */}
                  <div 
                    className="bg-gradient-to-r from-[#8630A1] to-[#4A22D4] rounded-none p-[14px] px-4 flex relative overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
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

replacement = """                  {/* Top: Promo Card */}
                  <div 
                    className="bg-gradient-to-r from-[#8630A1] to-[#4A22D4] rounded-none p-[14px] px-4 flex relative overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                    onClick={() => setActiveModal("redemptionCode")}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
                    
                    <div className="w-[45px] h-[45px] flex items-center justify-center rotate-12 shrink-0 brightness-110 drop-shadow-xl bg-white/10 rounded-full absolute right-4 top-3 z-10">
                      <Gift className="w-[28px] h-[28px] text-[#FF4FA3]" strokeWidth={1.5} />
                    </div>

                    <div className="flex flex-col gap-2 flex-1 z-10 relative pr-[50px]">
                      <div className="text-[16px] font-black bg-gradient-to-r from-[#FDD835] via-[#FF4FA3] to-[#4AD2FF] text-transparent bg-clip-text leading-tight w-full tracking-wide">
                        RESCUE PRESENTS
                      </div>
                      <button
                        className="bg-[#FF4FA3] text-white px-3 h-[28px] rounded-[14px] text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider flex items-center justify-center active:scale-95 transition-transform w-fit shadow-sm border-none text-left leading-[1.2]"
                        onClick={(e) => { e.stopPropagation(); setActiveModal("redemptionCode"); }}
                      >
                        Rescue presents of great value with a click
                      </button>
                    </div>
                  </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced promo card successfully")
else:
    print("Target promo card not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
