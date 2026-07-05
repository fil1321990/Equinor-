import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_card = '''                        return (
                          <div key={inv.id} className="relative bg-[#F8F9FF] rounded-[20px] mb-6 shadow-sm overflow-hidden flex flex-col p-4">
                            {/* Image Header */}
                            <div className="w-full relative">
                              <div className={`relative w-full aspect-[16/9] rounded-[20px] ${inv.planName.toLowerCase() === 'vip team exclusive project' ? 'bg-gradient-to-r from-red-900 to-black' : 'bg-gradient-to-br from-[#1F2937] to-[#111827]'} flex items-center justify-center overflow-hidden`}>
                                {product?.imageUrl ? (
                                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                ) : inv.planName.toLowerCase() === 'vip team exclusive project' ? (
                                  <>
                                    <div className="flex flex-col items-center justify-center z-10">
                                      <span className="text-[#FBBF24] font-black text-4xl tracking-widest drop-shadow-lg scale-y-110">VIP</span>
                                      <span className="text-white font-bold tracking-[0.3em] text-sm mt-1">GROUP</span>
                                    </div>
                                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/20 to-transparent z-0"></div>
                                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent z-0"></div>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FBBF24] to-[#F59E0B] flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.6)] z-10">
                                      <span className="text-white font-bold text-2xl tracking-tighter">VIP</span>
                                    </div>
                                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-3xl z-0"></div>
                                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#6366F1]/20 blur-3xl z-0"></div>
                                  </>
                                )}
                                {/* Removed Approved Badge */}
                              </div>
                            </div>
                            
                            <div className="pt-2 flex justify-between items-center h-[32px]">
                              <span className="bg-[#FFECEC] text-[#FF4D4F] px-3 py-1 rounded-full font-black text-[12px]">
                                T+{inv.tPlusDays || 1}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-mono tracking-wider text-[#5B5FEF]/80">CP{new Date(inv.startDate).getTime()}{inv.id.substring(0, 4)}</span>
                                <div className="opacity-40">
                                   <Barcode className="w-10 h-5 text-black" strokeWidth={1} />
                                </div>
                              </div>
                            </div>
                            
                            {/* Product details row */}
                            <div className="py-3 flex justify-between items-start mt-1">
                              <div className="flex flex-col flex-1 min-w-0 pr-2">
                                <h3 className="font-bold text-[#1E293B] text-[18px] leading-tight mb-1 truncate">{inv.planName}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="bg-[#E8E9FF] text-[#5B5FEF] px-3 py-1.5 rounded-[12px] font-black text-[18px] leading-none tracking-tight">₦{inv.amount.toLocaleString()}</span>
                                  <span className="text-[#FF4444] font-black text-[16px] leading-none">+{profitAccrued.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                </div>
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
                                  className={`bg-gradient-to-r from-[#EC4899] to-[#F43F5E] text-white px-6 h-[40px] rounded-[20px] font-black text-[14px] shadow-md transform transition flex flex-col justify-center items-center ${collectingIds[inv.id] ? 'opacity-80 scale-95' : 'active:scale-[0.98]'}`}
                                >
                                  {collectingIds[inv.id] ? "..." : "Get"}
                                </button>
                              ) : isExpired ? (
                                <span className="text-[#34C759] font-black px-5 py-2.5 border border-[#34C759]/20 rounded-[20px] bg-[#34C759]/5 text-[14px]">
                                  {inv.status === 'completed' ? 'Completed' : 'Expired'}
                                </span>
                              ) : (
                                <button
                                  className="bg-[#E8E9FF] text-[#A0A0A0] px-5 py-2.5 rounded-[20px] font-black text-[14px] cursor-not-allowed transform transition whitespace-nowrap"
                                >
                                  <div className="flex gap-1.5 items-center">
  <div className="bg-[#1A1A1A] text-white rounded w-7 h-7 flex items-center justify-center text-xs font-bold">{daysLeft}</div>
  <div className="bg-[#1A1A1A] text-white rounded w-7 h-7 flex items-center justify-center text-xs font-bold">{hoursLeft.toString().padStart(2, '0')}</div>
  <div className="bg-[#1A1A1A] text-white rounded w-7 h-7 flex items-center justify-center text-xs font-bold">{minutesLeft.toString().padStart(2, '0')}</div>
  <div className="bg-[#1A1A1A] text-white rounded w-7 h-7 flex items-center justify-center text-xs font-bold">{secondsLeft.toString().padStart(2, '0')}</div>
</div>
                                </button>
                              )}
                            </div>
                            
                            {/* Stats Grid Bottom Section */}
                            <div className="pb-2">
                              <div className="flex flex-wrap gap-2">
                                <div className="flex items-center whitespace-nowrap bg-[#E8E9FF] px-2 py-1 rounded-[8px] text-[#5B5FEF]">
                                  <span className="text-[#5B5FEF]/80 text-[11px]">Total income:</span>
                                  <span className="text-[#5B5FEF] font-black text-[12px] ml-1">₦{(dailyIncome * invCycleLength).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center whitespace-nowrap bg-[#E8E9FF] px-2 py-1 rounded-[8px] text-[#5B5FEF]">
                                  <span className="text-[#5B5FEF]/80 text-[11px]">Cycle:</span>
                                  <span className="text-[#5B5FEF] font-black text-[12px] ml-1">{invCycleLength} Days</span>
                                </div>
                                <div className="flex items-center whitespace-nowrap bg-[#E8E9FF] px-2 py-1 rounded-[8px] text-[#5B5FEF]">
                                  <span className="text-[#5B5FEF]/80 text-[11px]">Start:</span>
                                  <span className="text-[#5B5FEF] font-black text-[11px] ml-1">{new Date(inv.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center whitespace-nowrap bg-[#E8E9FF] px-2 py-1 rounded-[8px] text-[#5B5FEF]">
                                  <span className="text-[#5B5FEF]/80 text-[11px]">Daily income:</span>
                                  <span className="text-[#5B5FEF] font-black text-[12px] ml-1">₦{dailyIncome.toLocaleString()}</span>
                                </div>
                              </div>
                              
                              <div className="w-full bg-[#E2E8F0] h-[6px] rounded-full overflow-hidden mt-3">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#5B3DF6] to-[#7B2FF7] transition-all duration-1000"
                                  style={{ width: `${Math.min(100, (readingElapsedMs / maxElapsedCycleMs) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )'''

new_card = '''                        return (
                          <div key={inv.id} className="relative bg-[#F8F9FF] rounded-[20px] mb-4 shadow-sm p-4 w-full">
                            {/* 1. Full-width hero image, 12px rounded. */}
                            <div className="w-full h-[140px] rounded-[12px] overflow-hidden mb-3 bg-slate-800">
                              {product?.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                              ) : inv.planName.toLowerCase() === 'vip team exclusive project' ? (
                                <div className="w-full h-full bg-gradient-to-r from-red-900 to-black flex items-center justify-center relative">
                                  <div className="flex flex-col items-center justify-center z-10">
                                    <span className="text-[#FBBF24] font-black text-4xl tracking-widest drop-shadow-lg scale-y-110">VIP</span>
                                    <span className="text-white font-bold tracking-[0.3em] text-sm mt-1">GROUP</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#1F2937] to-[#111827] flex items-center justify-center">
                                   <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FBBF24] to-[#F59E0B] flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.6)]">
                                     <span className="text-white font-bold text-xl tracking-tighter">VIP</span>
                                   </div>
                                </div>
                              )}
                            </div>

                            {/* 2. Row: Left "T+7" pill #FFE5E5 text #FF4444. Right product code + barcode. */}
                            <div className="flex justify-between items-center mb-2">
                              <div className="bg-[#FFE5E5] text-[#FF4444] px-3 py-1 rounded-full text-[12px] font-bold">
                                T+{inv.tPlusDays || 1}
                              </div>
                              <div className="flex items-center gap-1.5 opacity-60">
                                <span className="text-[12px] font-mono text-[#1A1A1A]">CP{new Date(inv.startDate).getTime().toString().slice(-6)}</span>
                                <Barcode className="w-6 h-4 text-black" strokeWidth={1.5} />
                              </div>
                            </div>

                            {/* 3. Title "..." bold 18px #1A1A1A. Under it: StartTime and EndTime 12px #666. */}
                            <div className="mb-3">
                              <h3 className="font-bold text-[18px] text-[#1A1A1A] leading-tight mb-1 truncate">{inv.planName}</h3>
                              <div className="text-[12px] text-[#666666]">
                                {new Date(inv.startDate).toLocaleDateString()} {new Date(inv.startDate).toLocaleTimeString()} — {new Date(inv.endDate).toLocaleDateString()} {new Date(inv.endDate).toLocaleTimeString()}
                              </div>
                            </div>

                            {/* 4. Countdown: 4 black boxes #1A1A1A with white text " Day: HH : MM : SS", 8px radius. */}
                            <div className="flex items-center gap-1 mb-4 h-8">
                              {!canCollect && !isExpired && (
                                <>
                                  <div className="bg-[#1A1A1A] text-white rounded-[8px] px-2 py-1 flex items-center justify-center text-[13px] font-bold min-w-[32px] whitespace-nowrap">{daysLeft} Day</div>
                                  <div className="text-[#1A1A1A] font-bold">:</div>
                                  <div className="bg-[#1A1A1A] text-white rounded-[8px] px-2 py-1 flex items-center justify-center text-[13px] font-bold min-w-[32px] whitespace-nowrap">{hoursLeft.toString().padStart(2, '0')}</div>
                                  <div className="text-[#1A1A1A] font-bold">:</div>
                                  <div className="bg-[#1A1A1A] text-white rounded-[8px] px-2 py-1 flex items-center justify-center text-[13px] font-bold min-w-[32px] whitespace-nowrap">{minutesLeft.toString().padStart(2, '0')}</div>
                                  <div className="text-[#1A1A1A] font-bold">:</div>
                                  <div className="bg-[#1A1A1A] text-white rounded-[8px] px-2 py-1 flex items-center justify-center text-[13px] font-bold min-w-[32px] whitespace-nowrap">{secondsLeft.toString().padStart(2, '0')}</div>
                                </>
                              )}
                            </div>

                            {/* 5. 3 stat pills #E8E9FF: ₦280.00/Daily income, 280 d/Cycle, ₦78400.00/Total income. Text #5B5FEF centered. */}
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-1 flex flex-col items-center justify-center text-center">
                                <div className="text-[#5B5FEF] font-bold text-[12px]">₦{dailyIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                                <div className="text-[#5B5FEF]/70 text-[10px]">Daily income</div>
                              </div>
                              <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-1 flex flex-col items-center justify-center text-center">
                                <div className="text-[#5B5FEF] font-bold text-[12px]">{invCycleLength} d</div>
                                <div className="text-[#5B5FEF]/70 text-[10px]">Cycle</div>
                              </div>
                              <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-1 flex flex-col items-center justify-center text-center">
                                <div className="text-[#5B5FEF] font-bold text-[12px]">₦{(dailyIncome * invCycleLength).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                                <div className="text-[#5B5FEF]/70 text-[10px]">Total income</div>
                              </div>
                            </div>

                            {/* 6. Price pill #E8E9FF full width: "Price: ₦8000.00" + "Payment amount" #5B5FEF. */}
                            <div className="w-full bg-[#E8E9FF] rounded-[8px] px-3 py-2 flex justify-between items-center mb-4">
                              <span className="text-[#5B5FEF]/70 text-[12px]">Payment amount</span>
                              <span className="text-[#5B5FEF] font-bold text-[13px]">Price: ₦{inv.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                            </div>

                            {/* 7. Bottom: Left "Profit +₦1249.445" red #FF4444 bold. Right disabled "Get" button #E8E9FF text #A0A0A0 24px radius. */}
                            <div className="flex justify-between items-center mt-1">
                              <div className="text-[#FF4444] font-bold text-[18px]">
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
                                  className={`bg-[#FF4444] text-white px-6 py-2.5 rounded-[24px] font-bold text-[14px] ${collectingIds[inv.id] ? 'opacity-80 scale-95' : 'active:scale-95'}`}
                                >
                                  {collectingIds[inv.id] ? "..." : "Get"}
                                </button>
                              ) : isExpired ? (
                                <div className="bg-[#E8E9FF] text-[#A0A0A0] px-6 py-2.5 rounded-[24px] font-bold text-[14px]">
                                  {inv.status === 'completed' ? 'Completed' : 'Expired'}
                                </div>
                              ) : (
                                <button className="bg-[#E8E9FF] text-[#A0A0A0] px-6 py-2.5 rounded-[24px] font-bold text-[14px] cursor-not-allowed">
                                  Get
                                </button>
                              )}
                            </div>
                          </div>
                        )'''

if old_card in content:
    content = content.replace(old_card, new_card)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Successfully replaced card component")
else:
    print("Could not find exact block to replace")
    import re
    # Fallback to regex:
    # Match from: return (
    # down to: </div>\s*</div>\s*\)\s*\}\)\s*\)\}\s*</div>\s*</div>\s*</div>\s*</div>
    # Actually wait, maybe it's easier to just match from `return (\n                          <div key={inv.id}` to `                          </div>\n                        )`
    new_content = re.sub(
        r'return \(\s*<div key=\{inv\.id\}.*?</div>\s*\)\s*\}\)\s*\)\}',
        new_card + '\n                      })\n                    )}',
        content,
        flags=re.DOTALL
    )
    if new_content != content:
        with open('src/App.tsx', 'w') as f:
            f.write(new_content)
        print("Replaced via regex!")
    else:
        print("Regex fallback failed")
