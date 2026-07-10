const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `if (isPromoLocked) {
                                  triggerVisualNotification("alert", "Notice", "This product is currently locked for a promotional period.");
                                  return;
                                }`;
const replacement1 = `if (isButtonDisabled) {
                                  if (isPromoLocked) triggerVisualNotification("alert", "Notice", "This product is currently locked for a promotional period.");
                                  else if (isSoldOut) triggerVisualNotification("alert", "Notice", "This product is sold out.");
                                  else if (isQuotaReached) triggerVisualNotification("alert", "Notice", "You have already reached the maximum quota for this project.");
                                  return;
                                }`;

code = code.replace(target1, replacement1);

fs.writeFileSync('src/App.tsx', code);
