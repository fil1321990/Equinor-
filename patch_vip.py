import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = """    if (planName.toLowerCase() === "vip team exclusive project") {
      const aLevelSubordinates = users.filter(u => u.referredBy === currentUser.referralCode).length;
      if (aLevelSubordinates < 30) {
        triggerVisualNotification("alert", "Notice", "You need at least 30 team members to purchase the VIP Team Exclusive Project.");
        return;
      }
    }"""

replacement1 = """    if (planName.toLowerCase() === "vip team exclusive project") {
      if (userVipLevel.levelIndex < 9) {
        triggerVisualNotification("alert", "Notice", "You must be at least VIP9 to purchase the VIP Team Exclusive Project.");
        return;
      }
      const aLevelSubordinates = users.filter(u => u.referredBy === currentUser.referralCode).length;
      if (aLevelSubordinates < 30) {
        triggerVisualNotification("alert", "Notice", "You need at least 30 team members to purchase the VIP Team Exclusive Project.");
        return;
      }
    }"""

target2 = """                                if (isVipTeam) {
                                  const aLevelSubordinates = users.filter(u => u.referredBy === currentUser.referralCode).length;
                                  if (aLevelSubordinates < 30) {
                                    triggerVisualNotification("alert", "Notice", "You need at least 30 team members to purchase the VIP Team Exclusive Project.");
                                    return;
                                  }
                                }"""

replacement2 = """                                if (isVipTeam) {
                                  if (VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex < 9) {
                                    triggerVisualNotification("alert", "Notice", "You must be at least VIP9 to purchase the VIP Team Exclusive Project.");
                                    return;
                                  }
                                  const aLevelSubordinates = users.filter(u => u.referredBy === currentUser.referralCode).length;
                                  if (aLevelSubordinates < 30) {
                                    triggerVisualNotification("alert", "Notice", "You need at least 30 team members to purchase the VIP Team Exclusive Project.");
                                    return;
                                  }
                                }"""

if target1 in content:
    content = content.replace(target1, replacement1)
else:
    print("Target 1 not found")

if target2 in content:
    content = content.replace(target2, replacement2)
else:
    print("Target 2 not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Done")
