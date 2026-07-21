import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''                                Total income: ₦{totalIncome.toLocaleString()}'''
replacement = '''                                Total income: ₦{totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}'''

content = content.replace(target, replacement)

target2 = '''                                Daily income: ₦{calculatedDailyReturn.toLocaleString()}'''
replacement2 = '''                                Daily income: ₦{calculatedDailyReturn.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}'''

content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
