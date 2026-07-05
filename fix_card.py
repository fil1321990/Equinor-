import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

start_idx = content.find('return (\n                          <div key={inv.id} className="relative bg-[#F8F9FF] rounded-[20px] mb-4 shadow-sm p-4 w-full">')
end_idx = content.find('                      })\n                    )}')

if start_idx != -1 and end_idx != -1:
    old_card_str = content[start_idx:end_idx]
    
    new_card_str = '''return (
                          <div key={inv.id} className="relative bg-[#F8F9FF] rounded-[16px] mb-3 shadow-sm p-3 w-full">
                            {/* 1. Full-width hero image, 10px rounded. */}
                            <div className="w-full h-[90px] rounded-[10px] overflow-hidden mb-2 bg-slate-800">
                              {product?.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                              ) : inv.planName.toLowerCase() === 'vip team exclusive project' ? (
                                <div className="w-full h-full bg-gradient-to-r from-red-900 to-black flex items-center justify-center relative">
                                  <div className="flex flex-col items-center justify-center z-10">
                                    <span className="text-[#FBBF24] font-black text-2xl tracking-widest drop-shadow-lg scale-y-110">VIP</span>
                                    <span className="text-white font-bold tracking-[0.3em] text-[10px] mt-0.5">GROUP</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#1F2937] to-[#111827] flex items-center justify-center">
                                   <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FBBF24] to-[#F59E0B] flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.6)]">
                                     <span className="text-white font-bold text-lg tracking-tighter">VIP</span>
                                   </div>
                                </div>
                              )}
                            </div>

                            {/* 2. Row: Left "T+7" pill #FFE5E5 text #FF4444. Right product code + barcode. */}
                            <div className="flex justify-between items-center mb-1.5">
                              <div className="bg-[#FFE5E5] text-[#FF4444] px-2 py-0.5 rounded-full text-[11px] font-bold">
                                T+{inv.tPlusDays || 1}
                              </div>
                              <div className="flex items-center gap-1 opacity-60">
                                <span className="text-[11px] font-mono text-[#1A1A1A]">CP{new Date(inv.startDate).getTime().toString().slice(-6)}</span>
                                <Barcode className="w-5 h-3 text-black" strokeWidth={1.5} />
                              </div>
                            </div>

                            {/* 3. Title & Price row */}
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex flex-col min-w-0 pr-2">
                                <h3 className="font-bold text-[15px] text-[#1A1A1A] leading-tight mb-0.5 truncate">{inv.planName}</h3>
                                <div className="text-[10px] text-[#666666] leading-tight">
                                  {new Date(inv.startDate).toLocaleDateString()} {new Date(inv.startDate).toLocaleTimeString().slice(0,5)} — {new Date(inv.endDate).toLocaleDateString()} {new Date(inv.endDate).toLocaleTimeString().slice(0,5)}
                                </div>
                              </div>
                              <div className="flex flex-col items-end shrink-0">
                                <span className="text-[#5B5FEF]/70 text-[10px]">Price</span>
                                <span className="text-[#5B5FEF] font-bold text-[13px] leading-tight">₦{inv.amount.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                              </div>
                            </div>

                            {/* 4. Countdown: 4 black boxes #1A1A1A with white text " Day: HH : MM : SS", 6px radius. */}
                            <div className="flex items-center gap-1 mb-2 h-6">
                              {!canCollect && !isExpired && (
                                <>
                                  <div className="bg-[#1A1A1A] text-white rounded-[6px] px-1.5 py-0.5 flex items-center justify-center text-[11px] font-bold min-w-[28px] whitespace-nowrap">{daysLeft} D</div>
                                  <div className="text-[#1A1A1A] font-bold text-[11px]">:</div>
                                  <div className="bg-[#1A1A1A] text-white rounded-[6px] px-1.5 py-0.5 flex items-center justify-center text-[11px] font-bold min-w-[24px] whitespace-nowrap">{hoursLeft.toString().padStart(2, '0')}</div>
                                  <div className="text-[#1A1A1A] font-bold text-[11px]">:</div>
                                  <div className="bg-[#1A1A1A] text-white rounded-[6px] px-1.5 py-0.5 flex items-center justify-center text-[11px] font-bold min-w-[24px] whitespace-nowrap">{minutesLeft.toString().padStart(2, '0')}</div>
                                  <div className="text-[#1A1A1A] font-bold text-[11px]">:</div>
                                  <div className="bg-[#1A1A1A] text-white rounded-[6px] px-1.5 py-0.5 flex items-center justify-center text-[11px] font-bold min-w-[24px] whitespace-nowrap">{secondsLeft.toString().padStart(2, '0')}</div>
                                </>
                              )}
                            </div>

                            {/* 5. 3 stat pills #E8E9FF */}
                            <div className="grid grid-cols-3 gap-1.5 mb-3">
                              <div className="bg-[#E8E9FF] rounded-[6px] py-1 px-1 flex flex-col items-center justify-center text-center">
                                <div className="text-[#5B5FEF] font-bold text-[11px]">₦{dailyIncome.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
                                <div className="text-[#5B5FEF]/70 text-[9px]">Daily</div>
                              </div>
                              <div className="bg-[#E8E9FF] rounded-[6px] py-1 px-1 flex flex-col items-center justify-center text-center">
                                <div className="text-[#5B5FEF] font-bold text-[11px]">{invCycleLength} d</div>
                                <div className="text-[#5B5FEF]/70 text-[9px]">Cycle</div>
                              </div>
                              <div className="bg-[#E8E9FF] rounded-[6px] py-1 px-1 flex flex-col items-center justify-center text-center">
                                <div className="text-[#5B5FEF] font-bold text-[11px]">₦{(dailyIncome * invCycleLength).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
                                <div className="text-[#5B5FEF]/70 text-[9px]">Total</div>
                              </div>
                            </div>

                            {/* 7. Bottom: Left "Profit +₦1249.445" red #FF4444 bold. Right disabled "Get" button #E8E9FF text #A0A0A0 24px radius. */}
                            <div className="flex justify-between items-center">
                              <div className="text-[#FF4444] font-bold text-[15px]">
                                Profit +₦{profitAccrued.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                              </div>
                              
                              {canCollect ? (
                                <button 
                                  disabled={collectingIds[inv.id]}
                                  onClick={async () => {
                                     setCollectingIds(prev => ({ ...prev, [inv.id]: true }));
                                     const res = await collectEarnings(inv.id, true);
                                     if (res && res.success) {
                                       setSuccessAnimType("general");
                                       setSuccessAnimTitle("Income Collected!");
                                       setSuccessAnimMessage(`Profits for ${inv.planName} collected successfully.`);
                                       setSuccessAnimAmount(res.amount || null);
                                       setActiveModal("successAnimated");
                                     } else {
                                       if (res && res.message) {
                                         addNotification("Info", res.message, "info");
                                       }
                                     }
                                     setTimeout(() => {
                                       setCollectingIds(prev => { const n = {...prev}; delete n[inv.id]; return n; });
                                     }, 1000);
                                  }}
                                  className={`bg-[#FF4444] text-white px-5 py-2 rounded-[20px] font-bold text-[13px] ${collectingIds[inv.id] ? 'opacity-80 scale-95' : 'active:scale-95'}`}
                                >
                                  {collectingIds[inv.id] ? "..." : "Get"}
                                </button>
                              ) : isExpired ? (
                                <div className="bg-[#E8E9FF] text-[#A0A0A0] px-5 py-2 rounded-[20px] font-bold text-[13px]">
                                  {inv.status === 'completed' ? 'Completed' : 'Expired'}
                                </div>
                              ) : (
                                <button className="bg-[#E8E9FF] text-[#A0A0A0] px-5 py-2 rounded-[20px] font-bold text-[13px] cursor-not-allowed">
                                  Get
                                </button>
                              )}
                            </div>
                          </div>
                        )\n'''

    content = content[:start_idx] + new_card_str + content[end_idx:]
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Card successfully updated.")
else:
    print("Could not find start or end index.")

