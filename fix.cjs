const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const startStr = '<button \n                      disabled={isProcessing}';
const endStr = ') : isExpired ? (';

// Actually, let's find the exact string that is there right now.
const exactCurrentStr = `<button \n                      disabled={isProcessing}\n                      onClick={() => {\n                                     setActiveModal("acceptJoy");`;

const idx1 = code.indexOf(exactCurrentStr);
if (idx1 !== -1) {
  const idx2 = code.indexOf(endStr, idx1);
  if (idx2 !== -1) {
    const part1 = code.substring(0, idx1);
    const part2 = code.substring(idx2 + endStr.length);
    
    const fixString = `<button 
                      disabled={isProcessing}
                      onClick={async () => {
                        setIsProcessing(true);
                        await handleGetAll();
                        setTimeout(() => setIsProcessing(false), 1000);
                      }}
                      className={\`w-full py-2.5 rounded-[12px] font-bold text-[14px] mb-3 shrink-0 z-10 shadow-md transition-transform flex justify-center items-center \${isProcessing ? 'opacity-80 scale-[0.98]' : ''} \${totalCanBeCollected > 0 ? 'bg-[#7B2FFF] text-white active:scale-[0.98]' : 'bg-[#7B2FFF]/50 text-white/80 active:scale-[1]'}\`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                          </div>
                          <span>Collecting...</span>
                        </div>
                      ) : (
                        'Get All'
                      )}
                    </button>
                  )}
                  {/* Tab Navigation */}
                  <div className="flex w-full gap-2 mb-4 shrink-0 z-10">
                    {(['general', 'special', 'expired'] as const).map(tab => {
                      const isActive = orderTab === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setOrderTab(tab)}
                          className={\`flex-1 py-1.5 rounded-full text-[12px] font-bold transition-colors \${isActive ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#1A1A1A] border border-gray-200'}\`}
                        >
                          {tab === 'general' ? 'ACTIVE' : tab === 'special' ? 'SPECIAL' : 'EXPIRED'}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex-1 overflow-y-auto w-full pb-32 scrollbar-hide">
                    {filteredInvestments.length === 0 ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center -mt-20">
                        <EquinorStar className="w-24 h-24 text-white/20 mb-4" />
                      </div>
                    ) : (
                      filteredInvestments.map(inv => {
                        const product = products.find(p => p.name === inv.planName) as any;
                        const invNow = new Date();
                        const invStart = new Date(inv.startDate);
                        const invEnd = new Date(inv.endDate);
                        const invLastCollected = inv.lastCollectedDate ? new Date(inv.lastCollectedDate) : invStart;
                        const invMsInADay = 1000 * 3600 * 24;

                        const isExpired = invNow >= invEnd || inv.status === 'completed';

                        const tPlusDays = inv.tPlusDays || 1;
                        const maxElapsedCycleMs = Math.min(tPlusDays * invMsInADay, invEnd.getTime() - invLastCollected.getTime());
                        const currentElapsedMs = Math.max(0, invNow.getTime() - invLastCollected.getTime());

                        const msUntilNext = Math.max(0, maxElapsedCycleMs - currentElapsedMs);
                        const daysLeft = Math.floor(msUntilNext / invMsInADay);
                        const hoursLeft = Math.floor((msUntilNext / (1000 * 60 * 60)) % 24);
                        const minutesLeft = Math.floor((msUntilNext / 1000 / 60) % 60);
                        const secondsLeft = Math.floor((msUntilNext / 1000) % 60);

                        const expiryRemainingMs = Math.max(0, invEnd.getTime() - invNow.getTime());
                        const expYears = Math.floor(expiryRemainingMs / (1000 * 60 * 60 * 24 * 365));
                        const expDays = Math.floor((expiryRemainingMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
                        const expHours = Math.floor((expiryRemainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const expMinutes = Math.floor((expiryRemainingMs % (1000 * 60 * 60)) / (1000 * 60));
                        const expSeconds = Math.floor((expiryRemainingMs % (1000 * 60)) / 1000);

                        const readingElapsedMs = Math.min(currentElapsedMs, maxElapsedCycleMs);
                        const dailyIncome = getDailyIncome(inv, currentUser, users, investments);
                        const profitAccrued = (readingElapsedMs / invMsInADay) * dailyIncome;

                        const timeToCollectMs = Math.min(Math.min(currentElapsedMs, maxElapsedCycleMs), invEnd.getTime() - invLastCollected.getTime());
                        const isCycleComplete = currentElapsedMs >= maxElapsedCycleMs;
                        const canCollect = inv.status === 'active' && isCycleComplete;

                        return (
                          <div key={inv.id} className="relative bg-[#F8F9FF] rounded-[16px] mb-3 shadow-sm p-4 w-full">
                            {/* 1. Full-width hero image, 12-16px rounded. */}
                            <div className="w-full h-[80px] rounded-[12px] overflow-hidden mb-3 bg-slate-800">
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

                            {/* 2. Row: Left "T+7" pill. Right product code. */}
                            <div className="flex justify-between items-center mb-2">
                              <div className="bg-[#FFE5E5] text-[#FF4444] px-2 py-0.5 rounded-[4px] text-[12px] font-medium">
                                T+{inv.tPlusDays || 1}
                              </div>
                              <div className="flex flex-col items-end opacity-80">
                                <span className="text-[11px] font-mono text-[#333333]">CP{new Date(inv.startDate).getTime().toString().slice(-6)}</span>
                              </div>
                            </div>

                            {/* 3. Title & Countdown row */}
                            <div className="flex flex-col mb-3">
                              <h3 className="font-bold text-[18px] text-[#1A1A1A] leading-tight mb-2 truncate">{inv.planName}</h3>
                              <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-0.5">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[12px] text-[#666666]">StartTime:</span>
                                    <span className="text-[12px] font-medium text-[#1A1A1A]">{new Date(inv.startDate).toLocaleDateString()} {new Date(inv.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[12px] text-[#666666]">EndTime:</span>
                                    <span className="text-[12px] font-medium text-[#1A1A1A]">{new Date(inv.endDate).toLocaleDateString()} {new Date(inv.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end shrink-0 pl-2 self-end">
                                  {!canCollect && !isExpired ? (
                                    <div className="flex items-center gap-[2px]">
                                      {expDays > 0 && (
                                        <>
                                          <div className="bg-[#1A1A1A] text-white rounded-[4px] px-1.5 h-[28px] flex items-center justify-center text-[12px] font-bold">{expDays}</div>
                                          <div className="text-[#1A1A1A] font-medium text-[12px] px-0.5">d</div>
                                        </>
                                      )}
                                      <div className="bg-[#1A1A1A] text-white rounded-[4px] w-[26px] h-[28px] flex items-center justify-center text-[12px] font-bold">{expHours.toString().padStart(2, '0')}</div>
                                      <div className="text-[#1A1A1A] font-medium text-[10px] px-0.5">:</div>
                                      <div className="bg-[#1A1A1A] text-white rounded-[4px] w-[26px] h-[28px] flex items-center justify-center text-[12px] font-bold">{expMinutes.toString().padStart(2, '0')}</div>
                                      <div className="text-[#1A1A1A] font-medium text-[10px] px-0.5">:</div>
                                      <div className="bg-[#1A1A1A] text-white rounded-[4px] w-[26px] h-[28px] flex items-center justify-center text-[12px] font-bold">{expSeconds.toString().padStart(2, '0')}</div>
                                    </div>
                                  ) : (
                                    <div className="h-[28px]"></div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* 4. 3 stat pills */}
                            <div className="grid grid-cols-3 gap-[8px] mb-4">
                              <div className="bg-[#E8E9FF] rounded-[8px] py-2 px-1 flex flex-col items-center justify-center text-center">
                                <div className="text-[#5B5FEF] font-semibold text-[15px]">₦{dailyIncome.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
                                <div className="text-[#5B5FEF] text-[12px] whitespace-nowrap">Daily income</div>
                              </div>
                              <div className="bg-[#E8E9FF] rounded-[8px] py-2 px-1 flex flex-col items-center justify-center text-center">
                                <div className="text-[#5B5FEF] font-semibold text-[15px]">{tPlusDays} d</div>
                                <div className="text-[#5B5FEF] text-[12px] whitespace-nowrap">Cycle</div>
                              </div>
                              <div className="bg-[#E8E9FF] rounded-[8px] py-2 px-1 flex flex-col items-center justify-center text-center">
                                <div className="text-[#5B5FEF] font-semibold text-[15px]">₦{(dailyIncome * tPlusDays).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
                                <div className="text-[#5B5FEF] text-[12px] whitespace-nowrap">Total return</div>
                              </div>
                            </div>

                            {/* 5. Profit Row */}
                            <div className="flex justify-between items-center bg-white rounded-[12px] p-[12px] shadow-sm border border-gray-100">
                              <div className="flex items-center gap-2">
                                <span className="text-[#1A1A1A] font-medium text-[14px]">Profit</span>
                                <span className="text-[#FF4444] font-bold text-[18px]">
                                  +₦{profitAccrued.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </span>
                              </div>
                              
                              {canCollect ? (
                                <button
                                  disabled={stagedCollections.includes(inv.id)}
                                  onClick={() => {
                                     setActiveModal("acceptJoy");
                                     setStagedInvId(inv.id);
                                  }}
                                  className={\`bg-[#FF4444] text-white px-8 py-2 rounded-[24px] font-semibold text-[16px] \${stagedCollections.includes(inv.id) ? 'opacity-80 scale-95' : 'active:scale-95'}\`}
                                >
                                  {stagedCollections.includes(inv.id) ? "Collected" : "Get"}
                                </button>
                              ) : isExpired ? (`;
    
    fs.writeFileSync('src/App.tsx', part1 + fixString + part2);
    console.log("Fixed!");
  }
}
