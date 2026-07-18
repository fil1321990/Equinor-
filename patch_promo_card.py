import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """              {/* Promo Card */}
              <div className="mx-0 mb-5 bg-[#4A22D4] rounded-[16px] p-[2px] shadow-[0_0_20px_rgba(74,34,212,0.4)] relative h-[120px]">
                <div className="w-full h-full border border-white/20 rounded-[14px] relative overflow-hidden flex flex-col items-center justify-center flex-1 px-3 py-2 gap-2">
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
                  
                  <div className="text-[16px] font-extrabold text-white leading-tight drop-shadow-md z-10 w-full relative text-center tracking-wide">
                    RESCUE PRESENTS
                  </div>"""

replacement = """              {/* Promo Card */}
              <div className="mx-0 mb-5 bg-[#4A22D4] rounded-[16px] p-[2px] shadow-[0_0_20px_rgba(74,34,212,0.4)] relative h-[95px]">
                <div className="w-full h-full border border-white/20 rounded-[14px] relative overflow-hidden flex flex-col items-center justify-center flex-1 px-3 py-2 gap-2">
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
                  
                  <div className="text-[16px] font-black bg-gradient-to-r from-[#FDD835] via-[#FF4FA3] to-[#4AD2FF] text-transparent bg-clip-text leading-tight z-10 w-full relative text-center tracking-wide">
                    RESCUE PRESENTS
                  </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced Promo Card")
else:
    print("Promo Card not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
