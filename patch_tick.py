import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''      .filter(c => Date.now() <= c.createdAt + (c.validityMinutes * 60 * 1000) && c.claimedBy.length < c.maxClaims);
  }, [products]);'''

replacement = '''      .filter(c => Date.now() <= c.createdAt + (c.validityMinutes * 60 * 1000) && c.claimedBy.length < c.maxClaims);
  }, [products, tick]);'''

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
