import sys

with open("src/lib/earnings.ts", "r") as f:
    content = f.read()

target = """    const bonus = subordinateTotalDailyIncome * 0.01;
    dailyIncome = bonus;
  }"""

replacement = """    const bonus = subordinateTotalDailyIncome * 0.01;
    dailyIncome = (investment.fixedDailyReturn != null ? Number(investment.fixedDailyReturn) : 300) + bonus;
  }"""

if target in content:
    content = content.replace(target, replacement)
else:
    print("Target not found")

with open("src/lib/earnings.ts", "w") as f:
    f.write(content)
print("Done")
