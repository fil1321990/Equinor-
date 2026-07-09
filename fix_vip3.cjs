const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  `    if (planName.toLowerCase() === "vip team exclusive project") {`,
  `    if (planName.toLowerCase() === "vip member exclusive project") {\n      if (userVipLevel.levelIndex < 3) {\n        triggerVisualNotification("alert", "Notice", "You must be at least VIP3 to activate the VIP Member Exclusive Project.");\n        return;\n      }\n    }\n    if (planName.toLowerCase() === "vip team exclusive project") {`
);

code = code.replace(
  `                                if (isVipTeam) {`,
  `                                if (plan.name.toLowerCase() === 'vip member exclusive project') {\n                                  if (VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex < 3) {\n                                    triggerVisualNotification("alert", "Notice", "You must be at least VIP3 to activate the VIP Member Exclusive Project.");\n                                    return;\n                                  }\n                                }\n                                if (isVipTeam) {`
);

code = code.replace(
  `                                if (isVipTeam) {`,
  `                                if (plan.name.toLowerCase() === 'vip member exclusive project') {\n                                  if (VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex < 3) {\n                                    triggerVisualNotification("alert", "Notice", "You must be at least VIP3 to activate the VIP Member Exclusive Project.");\n                                    return;\n                                  }\n                                }\n                                if (isVipTeam) {`
);

fs.writeFileSync('src/App.tsx', code);
console.log("VIP3 fixed.");
