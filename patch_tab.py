import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("if (productTab === 'special') return pType === 'special' || isVip;", "if (productTab === 'special') return pType === 'special';")

target1 = """                                if (plan.type === "vip" && VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex === 0) {
                                  triggerVisualNotification("alert", "Notice", "This is a VIP product. You must be at least VIP1 to invest.");
                                  return;
                                }"""

replacement1 = """                                if (plan.type === "vip" && VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex === 0) {
                                  if (plan.name.toLowerCase() === 'vip team exclusive project') {
                                    triggerVisualNotification("alert", "Notice", "You must be at least VIP9 to purchase the VIP Team Exclusive Project.");
                                    return;
                                  }
                                  triggerVisualNotification("alert", "Notice", "This is a VIP product. You must be at least VIP1 to invest.");
                                  return;
                                }"""

if target1 in content:
    content = content.replace(target1, replacement1)
else:
    print("Target 1 not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Done")
