const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const target = `                                if (isButtonDisabled) {
                                  if (isPromoLocked) triggerVisualNotification("alert", "Notice", "This product is currently locked for a promotional period.");
                                  
                                  else if (isQuotaReached) triggerVisualNotification("alert", "Notice", "You have already reached the maximum quota for this project.");
                                  return;
                                }`;
const replacement = `                                if (isButtonDisabled) {
                                  if (isPromoLocked) triggerVisualNotification("alert", "Notice", "This product is currently locked for a promotional period.");
                                  else if (isSoldOut) triggerVisualNotification("alert", "Notice", "This product quota has been reached.");
                                  else if (isQuotaReached) triggerVisualNotification("alert", "Notice", "You have already reached the maximum quota for this project.");
                                  return;
                                }`;
if (content.includes(target)) {
  fs.writeFileSync('src/App.tsx', content.replace(target, replacement));
  console.log('Patched onClick logic');
} else {
  console.log('Target not found in src/App.tsx');
}
