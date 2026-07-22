import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = '''                        roi: (((Number(newProductFixedDaily) * Number(newProductDays)) - Number(newProductMin)) / Number(newProductMin)) * 100,
                        min: Number(newProductMin),'''
replacement1 = '''                        roi: (((Number(newProductFixedDaily) * Number(newProductDays)) - Number(newProductMin)) / Number(newProductMin)) * 100,
                        fixedDailyReturn: Number(newProductFixedDaily),
                        min: Number(newProductMin),'''

content = content.replace(target1, replacement1)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
