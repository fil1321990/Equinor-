import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                <div className="text-[24px] font-bold text-[#1A1A1A] leading-none mt-auto">{formatCurrency(currentUser.balance)}</div>"""
replacement = """                <div className="text-[18px] font-bold text-[#1A1A1A] leading-none mt-auto">{formatCurrency(currentUser.balance)}</div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced Balance size")
else:
    print("Balance size target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
