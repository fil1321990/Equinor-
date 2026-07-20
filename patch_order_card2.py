import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''  {/* T+ Collection Countdown */}
  <div className="flex justify-between items-center mb-3">'''

replacement = '''  {/* T+ Collection Countdown */}
  <div className="flex justify-between items-center mb-2">'''

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

