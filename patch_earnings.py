import sys

with open("src/lib/earnings.ts", "r") as f:
    content = f.read()

content = content.replace('investment.planName === "VIP Member Exclusive Project"', '(investment.planName || "").toLowerCase() === "vip member exclusive project"')
content = content.replace('investment.planName === "VIP Team Exclusive Project"', '(investment.planName || "").toLowerCase() === "vip team exclusive project"')
content = content.replace('subInv.planName === "VIP Team Exclusive Project"', '(subInv.planName || "").toLowerCase() === "vip team exclusive project"')

with open("src/lib/earnings.ts", "w") as f:
    f.write(content)
print("Done")
