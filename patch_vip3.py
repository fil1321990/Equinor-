import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = """                                if (plan.type === "vip" && VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex === 0) {
                                  if (plan.name.toLowerCase() === 'vip team exclusive project') {
                                    triggerVisualNotification("alert", "Notice", "You must be at least VIP9 to purchase the VIP Team Exclusive Project.");
                                    return;
                                  }
                                  triggerVisualNotification("alert", "Notice", "This is a VIP product. You must be at least VIP1 to invest.");
                                  return;
                                }"""

replacement1 = """                                if (plan.type === "vip" && VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex === 0) {
                                  if (plan.name.toLowerCase() === 'vip team exclusive project') {
                                    triggerVisualNotification("alert", "Notice", "You must be at least VIP9 to purchase the VIP Team Exclusive Project.");
                                    return;
                                  }
                                  if (plan.name.toLowerCase() === 'vip member exclusive project') {
                                    triggerVisualNotification("alert", "Notice", "You must be at least VIP1 to activate the VIP Member Exclusive Project.");
                                    return;
                                  }
                                  triggerVisualNotification("alert", "Notice", "This is a VIP product. You must be at least VIP1 to invest.");
                                  return;
                                }"""

target2 = """                              if (plan.type === "vip" && VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex === 0) {
                                if (plan.name.toLowerCase() === 'vip team exclusive project') {
                                  triggerVisualNotification("alert", "Notice", "You must be at least VIP9 to purchase the VIP Team Exclusive Project.");
                                  return;
                                }
                                triggerVisualNotification("alert", "Notice", "This is a VIP product. You must be at least VIP1 to invest.");
                                return;
                              }"""

replacement2 = """                              if (plan.type === "vip" && VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex === 0) {
                                if (plan.name.toLowerCase() === 'vip team exclusive project') {
                                  triggerVisualNotification("alert", "Notice", "You must be at least VIP9 to purchase the VIP Team Exclusive Project.");
                                  return;
                                }
                                if (plan.name.toLowerCase() === 'vip member exclusive project') {
                                  triggerVisualNotification("alert", "Notice", "You must be at least VIP1 to activate the VIP Member Exclusive Project.");
                                  return;
                                }
                                triggerVisualNotification("alert", "Notice", "This is a VIP product. You must be at least VIP1 to invest.");
                                return;
                              }"""

if target1 in content:
    content = content.replace(target1, replacement1)
if target2 in content:
    content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Done")
