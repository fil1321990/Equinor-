import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                      <button
                        className="bg-gradient-to-r from-[#FF4FA3] to-[#D53F8C] text-white px-3 h-[28px] rounded-[14px] text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider flex items-center justify-center active:scale-95 transition-transform w-fit shadow-[0_2px_10px_rgba(255,79,163,0.4)] border-[0.5px] border-white/20 text-left leading-[1.2]"
                        onClick={(e) => { e.stopPropagation(); setActiveModal("redemptionCode"); }}
                      >"""

replacement = """                      <button
                        className="bg-gradient-to-r from-[#FF4FA3] to-[#D53F8C] text-white px-3 h-[28px] rounded-[14px] text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider flex items-center justify-center active:scale-95 transition-transform w-fit shadow-[0_2px_10px_rgba(255,79,163,0.4)] border-[0.5px] border-white/20 text-center leading-[1.2]"
                        onClick={(e) => { e.stopPropagation(); setActiveModal("redemptionCode"); }}
                      >"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced button text alignment successfully")
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
