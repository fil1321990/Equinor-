import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """              {/* Balance Card */}
              <div className="mx-0 mb-3 bg-[#FDD835] rounded-[16px] p-3 flex flex-col h-[95px] shadow-none relative">
                <div className="text-[13px] font-bold text-[#1A1A1A] leading-none mb-1">Account balance</div>
                <div className="flex justify-end gap-2 pr-1 w-full relative z-10">
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
                <div className="text-[18px] font-bold text-[#1A1A1A] leading-none mt-auto">{formatCurrency(currentUser.balance)}</div>
              </div>

              {/* Promo Card */}
              <div className="mx-0 mb-5 bg-[#4A22D4] rounded-[16px] p-[2px] shadow-[0_0_20px_rgba(74,34,212,0.4)] relative h-[95px]">
                <div className="w-full h-full border border-white/20 rounded-[14px] relative overflow-hidden flex flex-col items-center justify-center flex-1 px-3 py-2 gap-2">
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
                  
                  <div className="text-[16px] font-black bg-gradient-to-r from-[#FDD835] via-[#FF4FA3] to-[#4AD2FF] text-transparent bg-clip-text leading-tight z-10 w-full relative text-center tracking-wide">
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
                </div>
              </div>

              {/* Menu Container */}
              <div className="mx-0 mb-5 bg-white rounded-[16px] overflow-hidden shadow-lg border border-gray-100">
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
                  { icon: Settings, label: "Set Up", action: () => setActiveModal("setup") },
                  { icon: Download, label: "Download", action: () => handleDownloadApp() },
                ].map((item, index, arr) => {
                  const badgeCount = item.label === "Customer Support" 
                    ? chatMessages.filter(m => currentUser?.role === 'admin' 
                        ? !m.receiverId && m.senderId !== currentUser?.id 
                        : m.receiverId === currentUser?.id).length 
                    : 0;
                  return (
                  <div
                    key={index}
                    onClick={item.action}
                    className={`flex items-center justify-between px-5 py-[22px] cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-black text-[15px] ${
                      index !== arr.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-gray-500 opacity-80" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.label === "Customer Support" && badgeCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                          {badgeCount}
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                )})}
                <div
                  onClick={logout}
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-red-500 font-bold border-t border-gray-100 text-[15px]"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 text-red-400 opacity-80" />
                    <span>Log Out</span>
                  </div>
                </div>
              </div>"""

replacement = """              {/* Container for Layout */}
              <div className="mx-4 flex flex-col max-w-[400px] w-full self-center">
                
                {/* Account balance card */}
                <div className="bg-[#FDD835] rounded-xl p-4 flex flex-col relative h-[95px] overflow-hidden shadow-sm">
                  <div className="text-[13px] font-bold text-[#1A1A1A] leading-none mb-1">Account balance</div>
                  <div className="flex justify-end gap-2 w-full relative z-10">
                    <button
                      onClick={() => setActiveModal("deposit")}
                      className="w-[55px] bg-[#1A1A1A] text-[#FFFFFF] h-[26px] rounded-full text-[9px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                    >
                      Recharge
                    </button>
                    <button
                      onClick={() => setActiveModal("withdraw")}
                      className="w-[55px] bg-[#1A1A1A] text-[#FFFFFF] h-[26px] rounded-full text-[9px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
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
                    <div className="text-[14px] font-extrabold bg-gradient-to-r from-[#FDD835] via-[#FF4FA3] to-[#4AD2FF] text-transparent bg-clip-text leading-tight z-10 w-full tracking-wide max-w-[70%]">
                      RESCUE PRESENTS<br/><span className="text-white text-[12px] font-bold opacity-90 leading-tight">OF GREAT VALUE WITH A CLICK</span>
                    </div>
                    <div className="w-[45px] h-[45px] flex items-center justify-center rotate-12 z-10 shrink-0 brightness-110 drop-shadow-xl relative mr-1">
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

              </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced layout successfully")
else:
    print("Target layout not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
