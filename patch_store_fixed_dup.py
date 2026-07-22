import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = '''                        type: newProductType,
                        fixedDailyReturn: newProductFixedDaily ? Number(newProductFixedDaily) : undefined,'''

replacement1 = '''                        type: newProductType,'''

content = content.replace(target1, replacement1)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
