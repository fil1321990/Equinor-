const fs = require('fs');
const content = fs.readFileSync('src/store.tsx', 'utf8');
const target = `      const quota = product.max_quota || product.maxQuota || 0;
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
      }`;
const replacement = `      const userQuota = product.max_quota || product.maxQuota || 0;
      const globalQuota = product.globalQuota || 0;
      const soldCount = product.sold_count || 0;
      if (userQuota > 0) {
        const userBoughtCount = investments.filter(inv => inv.userId === currentUser.id && inv.planName === planName && inv.status !== 'expired').reduce((sum, inv) => sum + (inv.quantity || 1), 0);
        if (userBoughtCount + (quantity || 1) > userQuota) {
          alert(\`You have reached the maximum purchase limit of \${userQuota} for this product\`);
          return;
        }
      }
      if (globalQuota > 0) {
        if (soldCount + (quantity || 1) > globalQuota) {
          alert(\`This product is sold out\`);
          return;
        }
      }`;
if (content.includes(target)) {
  fs.writeFileSync('src/store.tsx', content.replace(target, replacement));
  console.log('Patched src/store.tsx');
} else {
  console.log('Target not found in src/store.tsx');
}
