import sys

with open("src/store.tsx", "r") as f:
    content = f.read()

target = """    const dailyIncome = getDailyIncome(investment, currentUser, users, investments);
    const profitToCollect = (timeToCollectMs / msInADay) * dailyIncome;
    const newLastCollected = new Date(lastCollected.getTime() + timeToCollectMs);"""

replacement = """    const dailyIncome = getDailyIncome(investment, currentUser, users, investments);
    // Collect profit based on exactly the completed cycle time
    const profitToCollect = (timeToCollectMs / msInADay) * dailyIncome;
    // Reset timer exactly to current time so the next collection is 24 hours from now
    const newLastCollected = now;"""

if target in content:
    content = content.replace(target, replacement)
    print("Patched collectEarnings")
else:
    print("Target not found in collectEarnings")

with open("src/store.tsx", "w") as f:
    f.write(content)
