import sys

with open("src/App.tsx", "r") as f:
    lines = f.readlines()

replacement = """              {/* Container for Layout */}
              <div className="mx-4 flex flex-col max-w-[400px] w-full self-center">
                
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
                <div className="h-4 w-full bg-[#4B2A8C]"></div>

                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-[24px] p-4 flex flex-col w-full shadow-lg">
                  
                  {/* Top: Promo Card */}
                  <div 
                    className="bg-gradient-to-r from-[#8630A1] to-[#4A22D4] rounded-[16px] p-[14px] flex justify-between items-center relative overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                    onClick={() => setActiveModal("redemptionCode")}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
                    <div className="text-[16px] font-black bg-gradient-to-r from-[#FDD835] via-[#FF4FA3] to-[#4AD2FF] text-transparent bg-clip-text leading-tight z-10 w-full tracking-wide">
                      RESCUE PRESENTS
                    </div>
                    <div className="w-[32px] h-[32px] flex items-center justify-center rotate-12 z-10 shrink-0 brightness-110 drop-shadow-xl relative mr-1">
                      <Gift className="w-[32px] h-[32px] text-[#FF4FA3]" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Spacing 16px gap */}
                  <div className="h-4 w-full"></div>

                  {/* Bottom: Menu Container */}
                  <div className="bg-white rounded-[16px] overflow-hidden flex flex-col shadow-sm">
                    {[
                      { icon: FileText, label: "Funding details", action: () => setActiveModal("fundingDetails") },
                      { icon: ClipboardList, label: "Commission Record", action: () => setActiveModal("commissionRecord") },
                      { icon: BarChart2, label: "Income Record", action: () => setActiveModal("incomeRecord") },
                      { icon: Landmark, label: "Bank account", action: () => {
                        setBankAccountNumber(currentUser.bankDetails?.accountNumber || "");
                        setSelectedBankCode(currentUser.bankDetails?.bankCode || "");
                        setBankAccountName(currentUser.bankDetails?.accountName || "");
                        setIsEditingBank(false);
                        setActiveModal("bankDetails");
                      } },
                      { icon: Info, label: "About us", action: () => setActiveModal("about") },
                      { icon: Download, label: "Download", action: () => handleDownloadApp() },
                    ].map((item, index, arr) => (
                      <div
                        key={index}
                        onClick={item.action}
                        className={`flex items-center justify-between px-4 py-[14px] cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-black ${
                          index !== arr.length - 1 ? 'border-b border-[#F5F5F5]' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-[22px] h-[22px] text-gray-600 opacity-90" strokeWidth={1.8} />
                          <span className="font-medium text-[16px] text-gray-800">{item.label}</span>
                        </div>
                        <ChevronRight className="w-[18px] h-[18px] text-gray-400 opacity-40" strokeWidth={2} />
                      </div>
                    ))}
                    
                    {/* Log Out Button */}
                    <div
                      onClick={logout}
                      className="flex items-center justify-between px-4 py-[14px] cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-red-500 border-t border-[#F5F5F5]"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut className="w-[22px] h-[22px] text-red-400 opacity-90" strokeWidth={1.8} />
                        <span className="font-medium text-[16px]">Log Out</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>\n"""

# line indices are 0-based. 3535 is line index 3535 (meaning line 3536 in 1-based)
# wait, my start_idx was 3535 (meaning line 3536).
# line 3634 is the end of the `</div>` for Menu Container.
# Let's verify end by finding the exact string.

start = -1
end = -1
for i, line in enumerate(lines):
    if "{/* Balance Card */}" in line:
        start = i
    if "{/* Menu Container */}" in line:
        pass
    if "<span>Log Out</span>" in line:
        # the div ends 3 lines after this
        end = i + 3
        break

if start != -1 and end != -1:
    new_lines = lines[:start] + [replacement] + lines[end+1:]
    with open("src/App.tsx", "w") as f:
        f.writelines(new_lines)
    print(f"Replaced lines {start} to {end}")
else:
    print("Could not find bounds")
