import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''  {/* 2. Top Row: Left "T+7" pill, Right: Price */}
  <div className="flex justify-between items-center mb-1">
    <div className="bg-[#FFE5E5] text-[#FF4444] px-2 py-0.5 rounded-[4px] text-[12px] font-medium">
      T+{inv.payout_cycle_days || inv.tPlusDays || 1}
    </div>
    <div className="flex flex-col items-end">
      <span className="text-[15px] font-bold text-[#1A1A1A]">Price: ₦{inv.amount.toLocaleString()}</span>
    </div>
  </div>

  {/* 3. Title & Start/End Time Block */}
  <div className="flex flex-col mb-1">
    {(() => { let t: any = { color: "#1A1A1A", size: "18" }; try { const product = products.find(p => p.name === inv.planName) as any; if (product) { const parsed = JSON.parse(product.title || ""); if (parsed && parsed.text) t = parsed; } } catch(e) {} return <h3 className="font-bold leading-tight mb-1" style={{ color: t.color, fontSize: t.size + 'px' }}>{inv.planName}</h3>; })()}
    <div className="flex flex-col gap-0">
      <div className="flex items-center gap-1">
        <span className="text-[12px] text-[#666666]">StartTime:</span>
        <span className="text-[12px] font-medium text-[#1A1A1A]">{new Date(inv.startDate).toLocaleDateString()} {new Date(inv.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[12px] text-[#666666]">EndTime:</span>
        <span className="text-[12px] font-medium text-[#1A1A1A]">{new Date(inv.endDate).toLocaleDateString()} {new Date(inv.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
    </div>
  </div>

  {/* Duration Timer (Circles) Right-aligned */}
  <div className="flex justify-end mb-1">
    {!isExpired ? (
      <div className="flex items-center gap-1">
        {expYears > 0 && <div className="bg-black text-white rounded-full w-7 h-7 flex items-center justify-center text-[10px] font-bold">{expYears}Y</div>}
        {Math.floor(expDays/30) > 0 && <div className="bg-black text-white rounded-full w-7 h-7 flex items-center justify-center text-[10px] font-bold">{Math.floor(expDays/30)}M</div>}
        <div className="bg-black text-white rounded-full w-7 h-7 flex items-center justify-center text-[10px] font-bold">{expDays%30}d</div>
        <div className="bg-black text-white rounded-full w-7 h-7 flex items-center justify-center text-[10px] font-bold">{expHours.toString().padStart(2, '0')}h</div>
        <div className="bg-black text-white rounded-full w-7 h-7 flex items-center justify-center text-[10px] font-bold">{expMinutes.toString().padStart(2, '0')}m</div>
        <div className="bg-black text-white rounded-full w-7 h-7 flex items-center justify-center text-[10px] font-bold">{expSeconds.toString().padStart(2, '0')}s</div>
      </div>
    ) : (
      <div className="h-[28px]"></div>
    )}
  </div>

  {/* T+ Collection Countdown */}
  <div className="flex justify-between items-center mb-2">
    <div className="text-[12px] font-semibold text-[#1A1A1A]">Collection In:</div>
    <div className="flex items-center gap-[2px]">
      {!canCollect && !isExpired ? (
        <>
          {daysLeft > 0 && (
            <>
              <div className="bg-[#10B981] text-white rounded-[4px] px-1.5 h-[28px] flex items-center justify-center text-[12px] font-bold">{daysLeft}</div>
              <div className="text-[#10B981] font-medium text-[12px] px-0.5">d</div>
            </>
          )}
          <div className="bg-[#10B981] text-white rounded-[4px] w-[26px] h-[28px] flex items-center justify-center text-[12px] font-bold">{hoursLeft.toString().padStart(2, '0')}</div>
          <div className="text-[#10B981] font-medium text-[10px] px-0.5">:</div>
          <div className="bg-[#10B981] text-white rounded-[4px] w-[26px] h-[28px] flex items-center justify-center text-[12px] font-bold">{minutesLeft.toString().padStart(2, '0')}</div>
          <div className="text-[#10B981] font-medium text-[10px] px-0.5">:</div>
          <div className="bg-[#10B981] text-white rounded-[4px] w-[26px] h-[28px] flex items-center justify-center text-[12px] font-bold">{secondsLeft.toString().padStart(2, '0')}</div>
        </>
      ) : (
        <span className="text-[#10B981] font-bold text-[12px]">Ready</span>
      )}
    </div>
  </div>

  {/* 4. 4 stat pills */}
  <div className="grid grid-cols-4 gap-[4px] mb-2">
    <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-1 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="text-[#5B5FEF] font-semibold text-[11px] sm:text-[13px] truncate w-full">₦{dailyIncome.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
      <div className="text-[#5B5FEF] text-[9px] sm:text-[11px] whitespace-nowrap">Daily income</div>
    </div>
    <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-1 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="text-[#5B5FEF] font-semibold text-[11px] sm:text-[13px] truncate w-full">{inv.total_duration_days || inv.days || Math.round((invEnd.getTime() - invStart.getTime()) / (1000 * 3600 * 24))} D</div>
      <div className="text-[#5B5FEF] text-[9px] sm:text-[11px] whitespace-nowrap">Cycle</div>
    </div>
    <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-1 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="text-[#5B5FEF] font-semibold text-[11px] sm:text-[13px] truncate w-full">₦{(dailyIncome * (inv.total_duration_days || inv.days || Math.round((invEnd.getTime() - invStart.getTime()) / (1000 * 3600 * 24)))).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
      <div className="text-[#5B5FEF] text-[9px] sm:text-[11px] whitespace-nowrap">Total income</div>
    </div>
    {(() => {
      const quota = product?.max_quota || product?.maxQuota || 0;
      const userBoughtCount = investments.filter(i => i.userId === currentUser?.id && i.planName === inv.planName && i.status !== 'completed').reduce((sum, i) => sum + (i.quantity || 1), 0);
      return (
        <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-1 flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="text-[#5B5FEF] font-semibold text-[12px] sm:text-[13px]">{quota === 0 ? '∞' : `${userBoughtCount}/${quota}`}</div>
          <div className="text-[#5B5FEF] text-[9px] sm:text-[11px] whitespace-nowrap">Quota</div>
        </div>
      );
    })()}
  </div>'''

replacement = '''  {/* 3. Title */}
  <div className="flex flex-col mb-2">
    {(() => { let t: any = { color: "#1A1A1A", size: "18" }; try { const product = products.find(p => p.name === inv.planName) as any; if (product) { const parsed = JSON.parse(product.title || ""); if (parsed && parsed.text) t = parsed; } } catch(e) {} return <h3 className="font-bold leading-tight" style={{ color: t.color, fontSize: t.size + 'px' }}>{inv.planName}</h3>; })()}
  </div>

  {/* Start/End Time Block & Timer */}
  <div className="flex justify-between items-center mb-2">
    <div className="flex flex-col text-[8px] leading-[1.1] text-left w-fit">
      <div className="text-[#666666]">StartTime:</div>
      <div className="font-bold text-[#1A1A1A]">{new Date(inv.startDate).toLocaleDateString('en-GB')} {new Date(inv.startDate).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}</div>
      <div className="text-[#666666] mt-0.5">EndTime:</div>
      <div className="font-bold text-[#1A1A1A]">{new Date(inv.endDate).toLocaleDateString('en-GB')} {new Date(inv.endDate).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}</div>
    </div>
    
    <div className="flex items-center gap-[2px]">
      {!canCollect && !isExpired ? (
        <>
          {daysLeft > 0 && (
            <div className="bg-[#10B981] text-white rounded-[4px] px-1.5 h-[28px] flex items-center justify-center text-[12px] font-bold">{daysLeft} Days</div>
          )}
          <div className="bg-[#10B981] text-white rounded-[4px] w-[26px] h-[28px] flex items-center justify-center text-[12px] font-bold">{hoursLeft.toString().padStart(2, '0')}</div>
          <div className="text-[#10B981] font-medium text-[10px] px-0.5">:</div>
          <div className="bg-[#10B981] text-white rounded-[4px] w-[26px] h-[28px] flex items-center justify-center text-[12px] font-bold">{minutesLeft.toString().padStart(2, '0')}</div>
          <div className="text-[#10B981] font-medium text-[10px] px-0.5">:</div>
          <div className="bg-[#10B981] text-white rounded-[4px] w-[26px] h-[28px] flex items-center justify-center text-[12px] font-bold">{secondsLeft.toString().padStart(2, '0')}</div>
        </>
      ) : (
        <span className="text-[#10B981] font-bold text-[12px]">Ready</span>
      )}
    </div>
  </div>

  {/* 3-up grid: daily income, cycle, total income */}
  <div className="grid grid-cols-3 gap-[4px] mb-1">
    <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-1 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="text-[#5B5FEF] font-semibold text-[11px] sm:text-[13px] truncate w-full">₦{dailyIncome.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
      <div className="text-[#5B5FEF] text-[9px] sm:text-[11px] whitespace-nowrap">Daily income</div>
    </div>
    <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-1 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="text-[#5B5FEF] font-semibold text-[11px] sm:text-[13px] truncate w-full">{inv.total_duration_days || inv.days || Math.round((invEnd.getTime() - invStart.getTime()) / (1000 * 3600 * 24))} D</div>
      <div className="text-[#5B5FEF] text-[9px] sm:text-[11px] whitespace-nowrap">Cycle</div>
    </div>
    <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-1 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="text-[#5B5FEF] font-semibold text-[11px] sm:text-[13px] truncate w-full">₦{(dailyIncome * (inv.total_duration_days || inv.days || Math.round((invEnd.getTime() - invStart.getTime()) / (1000 * 3600 * 24)))).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
      <div className="text-[#5B5FEF] text-[9px] sm:text-[11px] whitespace-nowrap">Total income</div>
    </div>
  </div>

  {/* Full single width block below the 3-up grid for Price */}
  <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-3 mb-2 flex flex-col items-center justify-center text-center">
    <div className="text-[#5B5FEF] font-bold text-[13px] sm:text-[14px]">₦{inv.amount.toLocaleString()}</div>
    <div className="text-[#5B5FEF] text-[9px] sm:text-[11px]">Payment amount</div>
  </div>'''

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)

