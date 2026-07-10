const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  {/* 4. 3 stat pills */}
  <div className="grid grid-cols-3 gap-[8px] mb-4">
    <div className="bg-[#E8E9FF] rounded-[8px] py-2 px-1 flex flex-col items-center justify-center text-center">
      <div className="text-[#5B5FEF] font-semibold text-[15px]">₦{dailyIncome.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
      <div className="text-[#5B5FEF] text-[12px] whitespace-nowrap">Daily income</div>
    </div>
    <div className="bg-[#E8E9FF] rounded-[8px] py-2 px-1 flex flex-col items-center justify-center text-center">
      <div className="text-[#5B5FEF] font-semibold text-[15px]">{inv.total_duration_days || inv.days || Math.round((invEnd.getTime() - invStart.getTime()) / (1000 * 3600 * 24))} Days</div>
      <div className="text-[#5B5FEF] text-[12px] whitespace-nowrap">Cycle</div>
    </div>
    <div className="bg-[#E8E9FF] rounded-[8px] py-2 px-1 flex flex-col items-center justify-center text-center">
      <div className="text-[#5B5FEF] font-semibold text-[15px]">₦{(dailyIncome * (inv.total_duration_days || inv.days || Math.round((invEnd.getTime() - invStart.getTime()) / (1000 * 3600 * 24)))).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
      <div className="text-[#5B5FEF] text-[12px] whitespace-nowrap">Total return</div>
    </div>
  </div>`;

const replacement = `  {/* 4. 4 stat pills */}
  <div className="grid grid-cols-4 gap-[4px] mb-4">
    <div className="bg-[#E8E9FF] rounded-[8px] py-2 px-1 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="text-[#5B5FEF] font-semibold text-[11px] sm:text-[13px] truncate w-full">₦{dailyIncome.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
      <div className="text-[#5B5FEF] text-[9px] sm:text-[11px] whitespace-nowrap">Daily income</div>
    </div>
    <div className="bg-[#E8E9FF] rounded-[8px] py-2 px-1 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="text-[#5B5FEF] font-semibold text-[11px] sm:text-[13px] truncate w-full">{inv.total_duration_days || inv.days || Math.round((invEnd.getTime() - invStart.getTime()) / (1000 * 3600 * 24))} D</div>
      <div className="text-[#5B5FEF] text-[9px] sm:text-[11px] whitespace-nowrap">Cycle</div>
    </div>
    <div className="bg-[#E8E9FF] rounded-[8px] py-2 px-1 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="text-[#5B5FEF] font-semibold text-[11px] sm:text-[13px] truncate w-full">₦{(dailyIncome * (inv.total_duration_days || inv.days || Math.round((invEnd.getTime() - invStart.getTime()) / (1000 * 3600 * 24)))).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
      <div className="text-[#5B5FEF] text-[9px] sm:text-[11px] whitespace-nowrap">Total return</div>
    </div>
    {(() => {
      const quota = product?.max_quota || product?.maxQuota || 0;
      const userBoughtCount = investments.filter(i => i.userId === currentUser?.id && i.planName === inv.planName && i.status !== 'completed').reduce((sum, i) => sum + (i.quantity || 1), 0);
      return (
        <div className="bg-[#E8E9FF] rounded-[8px] py-2 px-1 flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="text-[#5B5FEF] font-semibold text-[12px] sm:text-[13px]">{quota === 0 ? '∞' : \`\${userBoughtCount}/\${quota}\`}</div>
          <div className="text-[#5B5FEF] text-[9px] sm:text-[11px] whitespace-nowrap">Quota</div>
        </div>
      );
    })()}
  </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
