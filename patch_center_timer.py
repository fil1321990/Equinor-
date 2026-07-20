import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''  {/* Start/End Time Block & Timer */}
  <div className="flex justify-between items-center mb-2">
    <div className="flex flex-col text-[8px] leading-[1.1] text-left w-fit">
      <div className="text-[#666666]">StartTime:</div>
      <div className="font-bold text-[#1A1A1A]">{new Date(inv.startDate).toLocaleDateString('en-GB')} {new Date(inv.startDate).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}</div>
      <div className="text-[#666666] mt-0.5">EndTime:</div>
      <div className="font-bold text-[#1A1A1A]">{new Date(inv.endDate).toLocaleDateString('en-GB')} {new Date(inv.endDate).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}</div>
    </div>
    
    <div className="flex items-center gap-[2px]">'''

replacement = '''  {/* Start/End Time Block & Timer */}
  <div className="flex items-center mb-2 relative">
    <div className="flex flex-col text-[8px] leading-[1.1] text-left shrink-0">
      <div className="text-[#666666]">StartTime:</div>
      <div className="font-bold text-[#1A1A1A]">{new Date(inv.startDate).toLocaleDateString('en-GB')} {new Date(inv.startDate).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}</div>
      <div className="text-[#666666] mt-0.5">EndTime:</div>
      <div className="font-bold text-[#1A1A1A]">{new Date(inv.endDate).toLocaleDateString('en-GB')} {new Date(inv.endDate).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}</div>
    </div>
    
    <div className="flex-1 flex justify-center items-center gap-[2px]">'''

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)

