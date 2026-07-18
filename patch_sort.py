import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                  if (productTab === 'special') return pType === 'special' || isVip;
                  if (productTab === 'vip') return isVip;
                  return pType === productTab.toLowerCase() && !isVip;
                }).map((plan: any) => {"""

replacement = """                  if (productTab === 'special') return pType === 'special' || isVip;
                  if (productTab === 'vip') return isVip;
                  return pType === productTab.toLowerCase() && !isVip;
                }).sort((a: any, b: any) => {
                  if (productTab === 'vip') {
                    const order = ['eq equity exchange project', 'vip member exclusive project', 'vip team exclusive project'];
                    const idxA = order.indexOf((a.name || '').toLowerCase());
                    const idxB = order.indexOf((b.name || '').toLowerCase());
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                  }
                  return (a.min || 0) - (b.min || 0);
                }).map((plan: any) => {"""

if target in content:
    content = content.replace(target, replacement)
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Done")
