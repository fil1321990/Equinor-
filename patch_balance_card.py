import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """              {/* Balance Card */}
              <div className="mx-4 mb-3 bg-[#FDD835] rounded-[16px] p-3 flex flex-col justify-between h-[95px] shadow-none">
                <div className="flex flex-col">
                  <div className="text-[12px] font-medium text-[#1A1A1A] leading-none mb-0.5">Account balance</div>
                  <div className="text-[22px] font-bold text-[#1A1A1A] leading-none">{formatCurrency(currentUser.balance)}</div>
                </div>
                <div className="flex justify-start gap-3 w-full">
                  <button
                    onClick={() => setActiveModal("deposit")}
                    className="w-[100px] bg-[#1A1A1A] text-[#FFFFFF] h-[28px] rounded-[14px] text-[11px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                  >
                    Recharge
                  </button>
                  <button
                    onClick={() => setActiveModal("withdraw")}
                    className="w-[100px] bg-[#1A1A1A] text-[#FFFFFF] h-[28px] rounded-[14px] text-[11px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                  >
                    Withdraw
                  </button>
                </div>
              </div>"""

replacement = """              {/* Balance Card */}
              <div className="mx-4 mb-3 bg-[#FDD835] rounded-[16px] p-3 flex flex-col justify-between h-[95px] shadow-none">
                <div className="flex justify-between items-start">
                  <div className="text-[13px] font-bold text-[#1A1A1A] leading-none mt-1">Account balance</div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setActiveModal("deposit")}
                      className="w-[85px] bg-[#1A1A1A] text-[#FFFFFF] h-[26px] rounded-[13px] text-[11px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                    >
                      Recharge
                    </button>
                    <button
                      onClick={() => setActiveModal("withdraw")}
                      className="w-[85px] bg-[#1A1A1A] text-[#FFFFFF] h-[26px] rounded-[13px] text-[11px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
                <div className="flex justify-start w-full">
                  <div className="text-[22px] font-bold text-[#1A1A1A] leading-none">{formatCurrency(currentUser.balance)}</div>
                </div>
              </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced Balance Card")
else:
    print("Balance Card target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)

