import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                {viewVipIndex < actualVipIndex ? (
                  <button 
                    disabled
                    className="w-full min-h-[44px] py-2 bg-black/10 text-[#212121] rounded-[12px] font-semibold flex items-center justify-center px-4 relative z-10 transition-colors">
                    <span className="text-[14px]">Level Unlocked</span>
                  </button>
                ) : viewVipIndex > actualVipIndex ? (
                  <button 
                    disabled
                    className="w-full min-h-[44px] py-2 bg-black/10 text-[#212121]/50 rounded-[12px] font-semibold flex items-center justify-center px-4 relative z-10 transition-colors">
                    <span className="text-[14px]">Reach {currentVipLevel.name} first</span>
                  </button>
                ) : nextVipLevel ? (
                  canUpgrade ? (
                    <button 
                      onClick={handleUpgradeVip}
                      className="w-full min-h-[44px] py-2 bg-gradient-to-r from-[#7B1FA2] to-[#9C27B0] text-white rounded-[12px] font-semibold flex items-center justify-center px-4 active:scale-95 transition-transform shadow-[0_4px_10px_rgba(156,39,176,0.3)] relative z-10">
                      <span className="text-[14px]">Upgrade to {nextVipLevel.name}</span>
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="w-full min-h-[44px] py-3 h-auto bg-gradient-to-r from-[#7B1FA2] to-[#9C27B0] text-white/90 rounded-[12px] font-semibold flex items-center justify-center px-4 relative z-10 opacity-70 cursor-not-allowed">
                      <span className="text-[14px] leading-tight text-center">Update with {nextVipLevel.requiredTotal} active friends to become {nextVipLevel.name} ({currentReferrals}/{nextVipLevel.requiredTotal})</span>
                    </button>
                  )
                ) : (
                  <button 
                    disabled
                    className="w-full min-h-[44px] py-2 bg-black/10 text-[#212121] rounded-[12px] font-semibold flex items-center justify-center px-4 relative z-10 transition-colors">
                    <span className="text-[14px]">Max Level Reached</span>
                  </button>
                )}
              </div>

              {/* Benefits Section */}
              <div className="w-full flex justify-start">
                <div className="flex flex-col gap-4 text-left">
                  <h3 className="text-[#FFB300] font-medium text-[15px] mb-2">{currentVipLevel.name} Privileges</h3>
                  
                  <p className="text-white/85 font-normal text-[14px] leading-relaxed">
                    Exclusive {currentVipLevel.name} Member Project available.
                  </p>
                  
                  {VIP_MEMBER_EXCLUSIVE_TIERS[currentVipLevel.name] && (
                    <>
                      <p className="text-white/85 font-normal text-[14px] leading-relaxed">
                        Earn extra ₦{VIP_MEMBER_EXCLUSIVE_TIERS[currentVipLevel.name].dailyIncome.toLocaleString()}/day (total value ₦{VIP_MEMBER_EXCLUSIVE_TIERS[currentVipLevel.name].totalRevenue.toLocaleString()}).
                      </p>
                    </>
                  )}
                  
                  {EQUITY_EXCHANGE_TIERS[currentVipLevel.name] && (
                    <p className="text-white/85 font-normal text-[14px] leading-relaxed">
                      EQ smart wallet transaction limit of ₦{EQUITY_EXCHANGE_TIERS[currentVipLevel.name].get24h.toLocaleString()}/day. ({EQUITY_EXCHANGE_TIERS[currentVipLevel.name].discount}% discount)
                    </p>
                  )}
                  
                  {nextVipLevel && (
                    <button
                      onClick={handleUpgradeVip}
                      disabled={!canUpgrade}
                      className="w-full mt-4 h-[44px] bg-gradient-to-r from-[#FFB300] to-[#FFD54F] text-[#212121] rounded-[12px] font-semibold flex items-center justify-center px-4 active:scale-95 transition-transform shadow-[0_4px_10px_rgba(255,179,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >"""

replacement = """                {viewVipIndex < actualVipIndex ? (
                  <button 
                    disabled
                    className="w-full min-h-[36px] py-1 bg-black/10 text-[#212121] rounded-[12px] font-semibold flex items-center justify-center px-4 relative z-10 transition-colors">
                    <span className="text-[14px]">Level Unlocked</span>
                  </button>
                ) : viewVipIndex > actualVipIndex ? (
                  <button 
                    disabled
                    className="w-full min-h-[36px] py-1 bg-black/10 text-[#212121]/50 rounded-[12px] font-semibold flex items-center justify-center px-4 relative z-10 transition-colors">
                    <span className="text-[14px]">Reach {currentVipLevel.name} first</span>
                  </button>
                ) : nextVipLevel ? (
                  canUpgrade ? (
                    <button 
                      onClick={handleUpgradeVip}
                      className="w-full min-h-[36px] py-1 bg-gradient-to-r from-[#7B1FA2] to-[#9C27B0] text-white rounded-[12px] font-semibold flex items-center justify-center px-4 active:scale-95 transition-transform shadow-[0_4px_10px_rgba(156,39,176,0.3)] relative z-10">
                      <span className="text-[14px]">Upgrade to {nextVipLevel.name}</span>
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="w-full min-h-[36px] py-1.5 h-auto bg-gradient-to-r from-[#7B1FA2] to-[#9C27B0] text-white/90 rounded-[12px] font-semibold flex items-center justify-center px-4 relative z-10 opacity-70 cursor-not-allowed">
                      <span className="text-[14px] leading-tight text-center">Update with {nextVipLevel.requiredTotal} active friends to become {nextVipLevel.name} ({currentReferrals}/{nextVipLevel.requiredTotal})</span>
                    </button>
                  )
                ) : (
                  <button 
                    disabled
                    className="w-full min-h-[36px] py-1 bg-black/10 text-[#212121] rounded-[12px] font-semibold flex items-center justify-center px-4 relative z-10 transition-colors">
                    <span className="text-[14px]">Max Level Reached</span>
                  </button>
                )}
              </div>

              {/* Benefits Section */}
              <div className="w-full flex justify-start">
                <div className="flex flex-col gap-1.5 text-left">
                  <h3 className="text-[#FFB300] font-medium text-[15px] mb-1">{currentVipLevel.name} Privileges</h3>
                  
                  <p className="text-white/85 font-normal text-[13px] leading-relaxed">
                    Exclusive {currentVipLevel.name} Member Project available.
                  </p>
                  
                  {VIP_MEMBER_EXCLUSIVE_TIERS[currentVipLevel.name] && (
                    <>
                      <p className="text-white/85 font-normal text-[13px] leading-relaxed">
                        Earn extra ₦{VIP_MEMBER_EXCLUSIVE_TIERS[currentVipLevel.name].dailyIncome.toLocaleString()}/day (total value ₦{VIP_MEMBER_EXCLUSIVE_TIERS[currentVipLevel.name].totalRevenue.toLocaleString()}).
                      </p>
                    </>
                  )}
                  
                  {EQUITY_EXCHANGE_TIERS[currentVipLevel.name] && (
                    <p className="text-white/85 font-normal text-[13px] leading-relaxed">
                      EQ smart wallet transaction limit of ₦{EQUITY_EXCHANGE_TIERS[currentVipLevel.name].get24h.toLocaleString()}/day. ({EQUITY_EXCHANGE_TIERS[currentVipLevel.name].discount}% discount)
                    </p>
                  )}
                  
                  {nextVipLevel && (
                    <button
                      onClick={handleUpgradeVip}
                      disabled={!canUpgrade}
                      className="w-full mt-2 h-[36px] bg-gradient-to-r from-[#FFB300] to-[#FFD54F] text-[#212121] rounded-[12px] font-semibold flex items-center justify-center px-4 active:scale-95 transition-transform shadow-[0_4px_10px_rgba(255,179,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >"""

if target in content:
    content = content.replace(target, replacement)
else:
    print("Target 2 not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Done")
