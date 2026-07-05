import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update card background, padding, border-radius
content = content.replace(
    'relative bg-[#D3D5DA] rounded-[24px] mb-6 shadow-md overflow-hidden flex flex-col p-1.5 border-4 border-[#0F1B2D]/5',
    'relative bg-[#F8F9FF] rounded-[20px] mb-6 shadow-sm overflow-hidden flex flex-col p-4'
)
# (Also remove the inner px-4 pt-4 if I changed the parent to p-4)
content = content.replace('className="px-4 pt-4', 'className="pt-2')
content = content.replace('className="px-4 py-3', 'className="py-3')
content = content.replace('className="px-4 pb-4"', 'className="pb-2"')

# 2. Update disabled Get button
content = content.replace(
    'className="bg-slate-300 text-slate-600 px-5 py-2.5 rounded-[20px] font-black text-[14px] cursor-not-allowed transform transition whitespace-nowrap"',
    'className="bg-[#E8E9FF] text-[#A0A0A0] px-5 py-2.5 rounded-[20px] font-black text-[14px] cursor-not-allowed transform transition whitespace-nowrap"'
)

# 3. Update Profit text #FF4444 bold
content = content.replace(
    'text-[#10B981] font-black text-[14px] ml-2 leading-none',
    'text-[#FF4444] font-black text-[14px] ml-2 leading-none'
)

# 4. Countdown 4 black boxes
countdown_replacement = """
<div className="flex gap-1.5 items-center">
  <div className="bg-[#1A1A1A] text-white rounded w-7 h-7 flex items-center justify-center text-xs font-bold">{daysLeft}</div>
  <div className="bg-[#1A1A1A] text-white rounded w-7 h-7 flex items-center justify-center text-xs font-bold">{hoursLeft.toString().padStart(2, '0')}</div>
  <div className="bg-[#1A1A1A] text-white rounded w-7 h-7 flex items-center justify-center text-xs font-bold">{minutesLeft.toString().padStart(2, '0')}</div>
  <div className="bg-[#1A1A1A] text-white rounded w-7 h-7 flex items-center justify-center text-xs font-bold">{secondsLeft.toString().padStart(2, '0')}</div>
</div>
"""
# find the fallback text {typeof formatTimeRemaining === 'function' ? formatTimeRemaining(msUntilNext) : "00:00:00"}
content = content.replace(
    '{typeof formatTimeRemaining === \'function\' ? formatTimeRemaining(msUntilNext) : "00:00:00"}',
    countdown_replacement
)

# 5. 3 stat pills and price pill
stats_grid_old = """<div className="bg-[#F8F9FA] rounded-[12px] py-2.5 px-3 grid grid-cols-2 gap-y-3 gap-x-1">"""
stats_grid_new = """<div className="flex flex-wrap gap-2">"""
content = content.replace(stats_grid_old, stats_grid_new)

# Modify stat items
content = content.replace(
    '<div className="flex items-center whitespace-nowrap">',
    '<div className="flex items-center whitespace-nowrap bg-[#E8E9FF] px-2 py-1 rounded-[8px] text-[#5B5FEF]">'
)
content = content.replace(
    '<div className="flex items-center justify-end whitespace-nowrap">',
    '<div className="flex items-center whitespace-nowrap bg-[#E8E9FF] px-2 py-1 rounded-[8px] text-[#5B5FEF]">'
)

content = content.replace('text-[#6B7280]', 'text-[#5B5FEF]/80')
content = content.replace('text-[#1C1C1E]', 'text-[#5B5FEF]')

with open('src/App.tsx', 'w') as f:
    f.write(content)
