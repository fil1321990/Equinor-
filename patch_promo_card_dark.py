import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                  {/* Top: Promo Card */}
                  <div 
                    className="bg-gradient-to-r from-[#8630A1] to-[#4A22D4] rounded-[16px] p-[14px] px-4 flex relative overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
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

replacement = """                  {/* Top: Promo Card */}
                  <div 
                    className="bg-[#1A0B2E] rounded-[16px] p-[14px] px-4 flex relative overflow-hidden shadow-[0_4px_20px_rgba(45,10,78,0.5)] cursor-pointer active:scale-[0.98] transition-transform group"
                    onClick={() => setActiveModal("redemptionCode")}
                  >
                    {/* Dark purple gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3b0a6d] via-[#1a0b2e] to-[#0a001a] z-0 pointer-events-none" />
                    
                    {/* Bling mercury glow effects */}
                    <div className="absolute -top-[40px] -right-[20px] w-[120px] h-[120px] bg-[#E0E7FF]/20 rounded-full blur-[30px] z-0 pointer-events-none transition-opacity group-hover:opacity-100 opacity-60" />
                    <div className="absolute -bottom-[30px] -left-[20px] w-[100px] h-[100px] bg-[#FF4FA3]/20 rounded-full blur-[25px] z-0 pointer-events-none" />
                    
                    {/* Thin mercury top & bottom lines */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#E0E7FF]/80 to-transparent shadow-[0_0_10px_#ffffff] z-10" />
                    <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#8630A1]/60 to-transparent z-10" />
                    
                    {/* Glass border overlay */}
                    <div className="absolute inset-0 border-[0.5px] border-white/10 rounded-[16px] z-10 pointer-events-none" />
                    
                    <div className="w-[45px] h-[45px] flex items-center justify-center rotate-12 shrink-0 brightness-110 drop-shadow-[0_0_15px_rgba(255,79,163,0.4)] bg-white/5 rounded-full absolute right-4 top-3 z-10 border-[0.5px] border-[#FF4FA3]/30 backdrop-blur-sm">
                      <Gift className="w-[28px] h-[28px] text-[#FF4FA3]" strokeWidth={1.5} />
                    </div>

                    <div className="flex flex-col gap-2 flex-1 z-10 relative pr-[50px]">
                      <div className="text-[16px] font-black bg-gradient-to-r from-[#FDD835] via-[#FF4FA3] to-[#4AD2FF] text-transparent bg-clip-text leading-tight w-full tracking-wide drop-shadow-[0_0_8px_rgba(255,79,163,0.3)]">
                        RESCUE PRESENTS
                      </div>
                      <button
                        className="bg-gradient-to-r from-[#FF4FA3] to-[#D53F8C] text-white px-3 h-[28px] rounded-[14px] text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider flex items-center justify-center active:scale-95 transition-transform w-fit shadow-[0_2px_10px_rgba(255,79,163,0.4)] border-[0.5px] border-white/20 text-left leading-[1.2]"
                        onClick={(e) => { e.stopPropagation(); setActiveModal("redemptionCode"); }}
                      >
                        Rescue presents of great value with a click
                      </button>
                    </div>
                  </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced promo card with dark purple mercury style")
else:
    print("Target promo card not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
