import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''  {/* Full single width block below the 3-up grid for Price */}
  <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-3 mb-2 flex flex-col items-center justify-center text-center">
    <div className="text-[#5B5FEF] font-bold text-[13px] sm:text-[14px]">₦{inv.amount.toLocaleString()}</div>
    <div className="text-[#5B5FEF] text-[9px] sm:text-[11px]">Payment amount</div>
  </div>'''

replacement = '''  {/* Full single width block below the 3-up grid for Price */}
  <div className="bg-[#E8E9FF] rounded-[8px] py-2 px-3 mb-2 flex flex-col items-center justify-center text-center">
    <div className="text-[#5B5FEF] font-bold text-[14px]">Price: ₦{inv.amount.toLocaleString()}</div>
    <div className="text-[#5B5FEF] text-[10px] mt-0.5">Payment amount</div>
  </div>'''

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)

