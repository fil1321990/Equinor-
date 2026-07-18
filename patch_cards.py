import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target_balance = """              {/* Balance Card */}
              <div className="mx-4 mb-3 bg-[#FDD835] rounded-[16px] p-3 flex flex-col justify-between h-[95px] shadow-none">
                <div className="text-[13px] font-bold text-[#1A1A1A] leading-none mt-1">Account balance</div>
                <div className="flex justify-between items-end w-full">
                  <div className="text-[22px] font-bold text-[#1A1A1A] leading-none">{formatCurrency(currentUser.balance)}</div>
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
              </div>"""

replacement_balance = """              {/* Balance Card */}
              <div className="mx-4 mb-3 bg-[#FDD835] rounded-[16px] p-4 flex flex-col h-[130px] shadow-none relative">
                <div className="text-[14px] font-bold text-[#1A1A1A] leading-none mb-2">Account balance</div>
                <div className="flex justify-end gap-2 pr-1 w-full relative z-10">
                  <button
                    onClick={() => setActiveModal("deposit")}
                    className="w-[85px] bg-[#1A1A1A] text-[#FFFFFF] h-[22px] rounded-[11px] text-[11px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                  >
                    Recharge
                  </button>
                  <button
                    onClick={() => setActiveModal("withdraw")}
                    className="w-[85px] bg-[#1A1A1A] text-[#FFFFFF] h-[22px] rounded-[11px] text-[11px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                  >
                    Withdraw
                  </button>
                </div>
                <div className="text-[28px] font-bold text-[#1A1A1A] leading-none mt-auto pb-1">{formatCurrency(currentUser.balance)}</div>
              </div>"""

if target_balance in content:
    content = content.replace(target_balance, replacement_balance)
    print("Replaced Balance Card")
else:
    print("Balance Card not found")

target_promo = """              {/* Promo Card */}
              <div className="mx-4 mb-5 bg-[#4A22D4] rounded-[16px] p-[2px] shadow-[0_0_20px_rgba(74,34,212,0.4)] relative h-[95px]">"""

replacement_promo = """              {/* Promo Card */}
              <div className="mx-4 mb-5 bg-[#4A22D4] rounded-[16px] p-[2px] shadow-[0_0_20px_rgba(74,34,212,0.4)] relative h-[120px]">"""

if target_promo in content:
    content = content.replace(target_promo, replacement_promo)
    print("Replaced Promo Card")
else:
    print("Promo Card not found")

target_menu = """                  <div
                    key={index}
                    onClick={item.action}
                    className={`flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-black text-[15px] ${"""

replacement_menu = """                  <div
                    key={index}
                    onClick={item.action}
                    className={`flex items-center justify-between px-5 py-[22px] cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-black text-[15px] ${"""

if target_menu in content:
    content = content.replace(target_menu, replacement_menu)
    print("Replaced Menu items padding")
else:
    print("Menu items padding not found")

with open("src/App.tsx", "w") as f:
    f.write(content)

