import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = """    if (planName.toLowerCase() === "vip member exclusive project") {
      if (userVipLevel.levelIndex < 3) {
        triggerVisualNotification("alert", "Notice", "You must be at least VIP3 to activate the VIP Member Exclusive Project.");
        return;
      }
    }"""

replacement1 = """    if (planName.toLowerCase() === "vip member exclusive project") {
      if (userVipLevel.levelIndex < 1) {
        triggerVisualNotification("alert", "Notice", "You must be at least VIP1 to activate the VIP Member Exclusive Project.");
        return;
      }
    }"""

target2 = """                                if (plan.name.toLowerCase() === 'vip member exclusive project') {
                                  if (VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex < 3) {
                                    triggerVisualNotification("alert", "Notice", "You must be at least VIP3 to activate the VIP Member Exclusive Project.");
                                    return;
                                  }
                                }"""

replacement2 = """                                if (plan.name.toLowerCase() === 'vip member exclusive project') {
                                  if (VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex < 1) {
                                    triggerVisualNotification("alert", "Notice", "You must be at least VIP1 to activate the VIP Member Exclusive Project.");
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
