import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = '''              <div className="w-full h-28 mb-4 overflow-hidden relative flex-shrink-0 flex items-center justify-center bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-4">'''

replacement1 = '''              <div className="w-full h-28 mb-4 overflow-hidden relative flex-shrink-0 flex items-center justify-center bg-white/5 border border-white/20 rounded-xl p-4">'''

content = content.replace(target1, replacement1)

target2 = '''                  {/* Bottom: Menu Container */}
                  <div className="bg-white rounded-[2rem] overflow-hidden flex flex-col shadow-sm mb-6">'''

replacement2 = '''                  {/* Bottom: Menu Container */}
                  <div className="bg-white rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm mb-6">'''

content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
