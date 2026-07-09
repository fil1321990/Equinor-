const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// In handleInvest:
code = code.replace(
  /if \(planName\.toLowerCase\(\) === "vip member exclusive project" \|\| planName\.toLowerCase\(\) === "vip team exclusive project"\) \{\s*const hasPurchased = investments\.some\(inv => inv\.userId === currentUser\.id && inv\.planName === planName\);\s*if \(hasPurchased\) \{\s*triggerVisualNotification\("alert", "Notice", "You have already reached the quota for this project\."\);\s*return;\s*\}\s*\}/,
  `// Also check quota for the specific product
    const product = products.find(p => p.name === planName);
    if (product && product.maxQuota > 0) {
      const userBoughtCount = investments.filter(inv => inv.userId === currentUser?.id && inv.planName === planName).reduce((sum, inv) => sum + (inv.quantity || 1), 0);
      if (userBoughtCount + (quantity || 1) > product.maxQuota) {
        triggerVisualNotification("alert", "Notice", "You will exceed the maximum quota for this product.");
        return;
      }
    }
    if (planName.toLowerCase() === "vip member exclusive project" || planName.toLowerCase() === "vip team exclusive project") {
      const hasPurchased = investments.some(inv => inv.userId === currentUser.id && inv.planName === planName);
      if (hasPurchased) {
        triggerVisualNotification("alert", "Notice", "You have already reached the quota for this project.");
        return;
      }
    }`
);

// In the UI where the user clicks "Rush to buy" (we'll replace all instances of this specific quota check block)
code = code.replace(
  /const hasPurchased = investments\.some\(inv => inv\.userId === currentUser\.id && inv\.planName === plan\.name\);\s*if \(hasPurchased\) \{\s*triggerVisualNotification\("alert", "Notice", "You have already reached the quota for this project\."\);\s*return;\s*\}/g,
  `const userBoughtCount = investments.filter(inv => inv.userId === currentUser.id && inv.planName === plan.name).reduce((sum, inv) => sum + (inv.quantity || 1), 0);
                                if (plan.maxQuota > 0 && userBoughtCount >= plan.maxQuota) {
                                  triggerVisualNotification("alert", "Notice", "You have already reached the maximum quota for this project.");
                                  return;
                                }`
);

fs.writeFileSync('src/App.tsx', code);
