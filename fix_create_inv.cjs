const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const target = `if (!currentUser) return;
    
    if (amount > currentUser.balance) {`;

const replacement = `if (!currentUser) return;

    const product = products.find(p => p.name === planName);
    if (product) {
      const quota = product.max_quota || product.maxQuota || 0;
      const soldCount = product.sold_count || 0;
      if (quota > 0) {
        const userBoughtCount = investments.filter(inv => inv.userId === currentUser.id && inv.planName === planName && inv.status !== 'expired').reduce((sum, inv) => sum + (inv.quantity || 1), 0);
        if (userBoughtCount + (quantity || 1) > quota) {
          alert(\`You have reached the maximum purchase limit of \${quota} for this product\`);
          return;
        }
        if (soldCount >= quota) {
          alert(\`This product is sold out\`);
          return;
        }
      }
    }
    
    if (amount > currentUser.balance) {`;

code = code.replace(target, replacement);
fs.writeFileSync('src/store.tsx', code);
