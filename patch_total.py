import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "const totalIncome = calculatedDailyReturn * (plan.total_duration_days || plan.days || 1);",
    "const totalIncome = Number((calculatedDailyReturn * (plan.total_duration_days || plan.days || 1)).toFixed(2));"
)

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Done")
