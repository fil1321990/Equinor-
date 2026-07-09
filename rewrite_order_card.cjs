const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /<div key=\{inv\.id\} className="relative bg-\[\#F8F9FF\] rounded-\[16px\] mb-3 shadow-sm p-4 w-full">([\s\S]*?)\{\/\* 5\. Profit Row \*\/\}/g;

const newContent = `
<div key={inv.id} className="relative bg-[#F8F9FF] rounded-[16px] mb-3 shadow-sm p-4 w-full">
  {/* 1. Full-width hero image */}
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

  {/* 2. Top Row: Left "T+7" pill, Right: Price */}
  <div className="flex justify-between items-center mb-2">
    <div className="bg-[#FFE5E5] text-[#FF4444] px-2 py-0.5 rounded-[4px] text-[12px] font-medium">
      T+{inv.tPlusDays || 1}
    </div>
    <div className="flex flex-col items-end">
      <span className="text-[15px] font-bold text-[#1A1A1A]">Price: ₦{inv.amount.toLocaleString()}</span>
    </div>
  </div>

  {/* 3. Title & Start/End Time Block */}
  <div className="flex flex-col mb-1">
    <h3 className="font-bold text-[18px] text-[#1A1A1A] leading-tight mb-1">{inv.planName}</h3>
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
  <div className="flex justify-end mb-2">
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
  <div className="flex justify-between items-center mb-3">
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
`;

const modifiedCode = code.replace(regex, newContent);

if (code !== modifiedCode) {
    fs.writeFileSync('src/App.tsx', modifiedCode);
    console.log("Order cards replaced.");
} else {
    console.log("Regex didn't match anything.");
}

