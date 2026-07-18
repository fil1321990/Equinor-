import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                {/* Spacing 16px gap with purple background */}
                <div className="h-4 w-full bg-[#4B2A8C]"></div>

                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-[24px] p-4 flex flex-col w-full shadow-lg">
                  
                  {/* Top: Promo Card */}
                  <div 
                    className="bg-gradient-to-r from-[#8630A1] to-[#4A22D4] rounded-[16px] p-[14px] flex justify-between items-center relative overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                    onClick={() => setActiveModal("redemptionCode")}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
                    <div className="text-[14px] font-extrabold bg-gradient-to-r from-[#FDD835] via-[#FF4FA3] to-[#4AD2FF] text-transparent bg-clip-text leading-tight z-10 w-full tracking-wide max-w-[70%]">
                      RESCUE PRESENTS<br/><span className="text-white text-[12px] font-bold opacity-90 leading-tight">OF GREAT VALUE WITH A CLICK</span>
                    </div>
                    <div className="w-[45px] h-[45px] flex items-center justify-center rotate-12 z-10 shrink-0 brightness-110 drop-shadow-xl relative mr-1">
                      <Gift className="w-[32px] h-[32px] text-[#FF4FA3]" strokeWidth={1.5} />
                    </div>
                  </div>"""

replacement = """                {/* Spacing 16px gap with purple background */}
                <div className="h-4 w-full"></div>

                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-[24px] p-4 flex flex-col w-full shadow-lg">
                  
                  {/* Top: Promo Card */}
                  <div 
                    className="bg-gradient-to-r from-[#8630A1] to-[#4A22D4] rounded-[16px] p-[14px] flex flex-col items-center justify-center relative overflow-hidden shadow-sm"
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
                    <div className="text-[16px] font-black bg-gradient-to-r from-[#FDD835] via-[#FF4FA3] to-[#4AD2FF] text-transparent bg-clip-text leading-tight z-10 w-full text-center tracking-wide mb-3">
                      RESCUE PRESENTS
                    </div>
                    
                    <button
                      className="bg-[#FF4FA3] text-white px-2 h-[32px] rounded-[16px] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center active:scale-95 transition-transform w-[180px] shadow-sm border-none z-10 relative"
                      onClick={() => setActiveModal("redemptionCode")}
                    >
                      Check presents
                    </button>

                    <div className="absolute right-4 bottom-1 w-[40px] h-[40px] flex items-center justify-center rotate-12 z-10 shrink-0 brightness-110 drop-shadow-xl">
                      <Gift className="w-[30px] h-[30px] text-[#FF4FA3]" strokeWidth={1.5} />
                    </div>
                  </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced layout successfully")
else:
    print("Target layout not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
