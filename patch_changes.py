import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = """                    {/* Top Row: Account balance label */}
                    <div className="flex w-full justify-start relative z-10">
                      <div className="text-[10px] font-bold text-[#1A1A1A] leading-none opacity-80">Account balance</div>
                    </div>"""

replacement1 = """                    {/* Top Row: Account balance label */}
                    <div className="flex w-full justify-start relative z-10">
                      <div className="text-[11px] font-black text-[#1A1A1A] leading-none">Account balance</div>
                    </div>"""

target2 = """                <div className="flex flex-col items-center mt-2 opacity-80 pb-2">
                  <span className="text-white text-[12px] text-center">
                    Earn <span className="font-bold text-[#FFD700]">₦10,000</span> for every new VIP level your invitee unlocks!
                  </span>
                </div>"""

replacement2 = """                <div className="flex flex-col items-center mt-2 opacity-80 pb-2">
                  <span className="text-white text-[12px] text-center">
                    Earn <span className="font-bold text-[#FFD700]">₦1,500</span> for every new VIP level your invitee unlocks!
                  </span>
                </div>"""

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Replaced account balance text successfully")
else:
    print("Target1 not found")

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Replaced invite amount successfully")
else:
    print("Target2 not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
