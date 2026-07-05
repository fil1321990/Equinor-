import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<span className="text-[#D32F2F] font-black text-[22px] leading-none tracking-tight">₦{inv.amount.toLocaleString()}</span>',
    '<span className="bg-[#E8E9FF] text-[#5B5FEF] px-3 py-1.5 rounded-[12px] font-black text-[18px] leading-none tracking-tight">₦{inv.amount.toLocaleString()}</span>'
)

# Remove ml-2 from profit so it uses gap-2
content = content.replace(
    '<span className="text-[#FF4444] font-black text-[14px] ml-2 leading-none">+{profitAccrued',
    '<span className="text-[#FF4444] font-black text-[16px] leading-none">+{profitAccrued'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
