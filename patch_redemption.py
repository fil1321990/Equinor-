import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''  const validRedemptionCodes = useMemo(() => {
    return products
      .filter(p => p.type === 'redemption_code')
      .map(p => {
        let claimedBy = [];
        try { claimedBy = p.title ? JSON.parse(p.title) : []; } catch (e) { }
        return {
          code: p.name,
          amount: p.min,
          minClaims: p.days,
          maxClaims: p.maxQuota || 1,
          validityMinutes: p.tPlusDays || 60,
          claimedBy,
          createdAt: p.roi
        };
      });
  }, [products]);'''

replacement = '''  const validRedemptionCodes = useMemo(() => {
    return products
      .filter(p => p.type === 'redemption_code')
      .map(p => {
        let claimedBy = [];
        try { claimedBy = p.title ? JSON.parse(p.title) : []; } catch (e) { }
        return {
          id: p.id,
          code: p.name,
          amount: p.min,
          minClaims: p.days,
          maxClaims: p.maxQuota || 1,
          validityMinutes: p.tPlusDays || 60,
          claimedBy,
          createdAt: p.roi
        };
      })
      .filter(c => Date.now() <= c.createdAt + (c.validityMinutes * 60 * 1000) && c.claimedBy.length < c.maxClaims);
  }, [products]);'''

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
