import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''  {/* 2. Top Row: Left "T+7" pill, Right: Price */}
  <div className="flex justify-between items-center mb-2">'''

replacement = '''  {/* 2. Top Row: Left "T+7" pill, Right: Price */}
  <div className="flex justify-between items-center mb-1">'''

content = content.replace(target, replacement)

target2 = '''  {/* Duration Timer (Circles) Right-aligned */}
  <div className="flex justify-end mb-2">'''

replacement2 = '''  {/* Duration Timer (Circles) Right-aligned */}
  <div className="flex justify-end mb-1">'''

content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)

