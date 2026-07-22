import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''                  {/* Bottom: Menu Container */}
                  <div className="bg-white rounded-[24px] overflow-hidden flex flex-col shadow-sm mb-6">'''

replacement = '''                  {/* Bottom: Menu Container */}
                  <div className="bg-white rounded-[2rem] overflow-hidden flex flex-col shadow-sm mb-6">'''

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
