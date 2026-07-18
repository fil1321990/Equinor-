import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                  <button onClick={() => setActiveModal("deposit")} className="bg-[#F3F0FF] rounded-[20px] h-[72px] basis-[45%] flex-grow-0 flex flex-col items-center justify-center active:opacity-80 transition-opacity mx-auto">
                    <div className="flex items-center gap-2">
                       <ArrowRightCircle size={24} className="text-[#7B61FF]" style={{ strokeWidth: 1.5 }} />
                       <span className="text-[#1E1F24] text-[13px] font-medium leading-[1.2]">Recharge</span>
                    </div>
                  </button>
                  <button onClick={() => setActiveModal("withdraw")} className="bg-[#F3F0FF] rounded-[20px] h-[72px] basis-[45%] flex-grow-0 flex flex-col items-center justify-center active:opacity-80 transition-opacity mx-auto">
                    <div className="flex items-center gap-2">
                       <CreditCard size={24} className="text-[#7B61FF]" style={{ strokeWidth: 1.5 }} />
                       <span className="text-[#1E1F24] text-[13px] font-medium leading-[1.2]">Withdrawal</span>
                    </div>
                  </button>"""

replacement = """                  <div className="w-full flex justify-center gap-4">
                    <button onClick={() => setActiveModal("deposit")} className="bg-[#F3F0FF] rounded-[20px] h-[72px] w-[140px] flex flex-col items-center justify-center active:opacity-80 transition-opacity">
                      <div className="flex items-center gap-2">
                         <ArrowRightCircle size={24} className="text-[#7B61FF]" style={{ strokeWidth: 1.5 }} />
                         <span className="text-[#1E1F24] text-[13px] font-medium leading-[1.2]">Recharge</span>
                      </div>
                    </button>
                    <button onClick={() => setActiveModal("withdraw")} className="bg-[#F3F0FF] rounded-[20px] h-[72px] w-[140px] flex flex-col items-center justify-center active:opacity-80 transition-opacity">
                      <div className="flex items-center gap-2">
                         <CreditCard size={24} className="text-[#7B61FF]" style={{ strokeWidth: 1.5 }} />
                         <span className="text-[#1E1F24] text-[13px] font-medium leading-[1.2]">Withdrawal</span>
                      </div>
                    </button>
                  </div>"""

if target in content:
    content = content.replace(target, replacement)
else:
    print("Not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Done")
