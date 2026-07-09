const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  `                                if (plan.name.toLowerCase() === 'vip member exclusive project') {\n                                  if (VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex < 3) {\n                                    triggerVisualNotification("alert", "Notice", "You must be at least VIP3 to activate the VIP Member Exclusive Project.");\n                                    return;\n                                  }\n                                }\n                                if (plan.name.toLowerCase() === 'vip member exclusive project') {\n                                  if (VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex < 3) {\n                                    triggerVisualNotification("alert", "Notice", "You must be at least VIP3 to activate the VIP Member Exclusive Project.");\n                                    return;\n                                  }\n                                }`,
  `                                if (plan.name.toLowerCase() === 'vip member exclusive project') {\n                                  if (VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex < 3) {\n                                    triggerVisualNotification("alert", "Notice", "You must be at least VIP3 to activate the VIP Member Exclusive Project.");\n                                    return;\n                                  }\n                                }`
);

fs.writeFileSync('src/App.tsx', code);
