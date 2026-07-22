import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''                              setNewProductDescription(p.description || "");
                              setNewProductRoi(p.roi.toString());
                              setNewProductMin(p.min.toString());'''

replacement = '''                              setNewProductDescription(p.description || "");
                              setNewProductFixedDaily(p.fixedDailyReturn ? p.fixedDailyReturn.toString() : (p.min * (1 + p.roi / 100) / (p.total_duration_days || p.days)).toFixed(2));
                              setNewProductMin(p.min.toString());'''

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
