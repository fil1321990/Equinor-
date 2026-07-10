const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `if (isPromoLocked) {
                                  triggerVisualNotification("alert", "Notice", "This product is not yet available.");
                                  return;
                                }`;
const replacement = `if (isButtonDisabled) {
                                  if (isPromoLocked) triggerVisualNotification("alert", "Notice", "This product is not yet available.");
                                  else if (isSoldOut) triggerVisualNotification("alert", "Notice", "This product is sold out.");
                                  else if (isQuotaReached) triggerVisualNotification("alert", "Notice", "You have reached the maximum quota for this project.");
                                  return;
                                }`;

code = code.replace(/if \(isPromoLocked\) \{\s*triggerVisualNotification\("alert", "Notice", "This product is not yet available."\);\s*return;\s*\}/g, replacement);

fs.writeFileSync('src/App.tsx', code);
