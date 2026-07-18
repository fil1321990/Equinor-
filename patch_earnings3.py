import sys

with open("src/lib/earnings.ts", "r") as f:
    content = f.read()

target = "return dailyIncome;"
replacement = """dailyIncome = Number(dailyIncome.toFixed(2));
  return dailyIncome;"""

content = content.replace(target, replacement)

# We should also let preview show the base daily income without subordinate calculation if id === "mock"
# Wait, currently it's:
# if ((investment.planName || "").toLowerCase() === "vip team exclusive project" && user && investment.id !== "mock") {
# What if it's mock? It gets calculated at the beginning:
# let dailyIncome = investment.fixedDailyReturn != null ? Number(investment.fixedDailyReturn) ...
# For VIP team exclusive project, fixedDailyReturn might be 300 (or whatever it's set to).
# So mock will show 300. Which is fine.
# We also want to make sure subordinate calculation doesn't throw.

with open("src/lib/earnings.ts", "w") as f:
    f.write(content)
print("Done")
