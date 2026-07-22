import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-t-[32px] pt-6 px-4 -mx-5 -mb-32 flex flex-col flex-1 w-[calc(100%+40px)] min-h-[calc(100vh-250px)] shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">'''

replacement = '''                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-t-[32px] pt-6 pb-32 px-4 -mx-5 -mb-32 flex flex-col flex-1 w-[calc(100%+40px)] min-h-[calc(100vh-250px)] shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">'''

content = content.replace(target, replacement)

target2 = '''                  {/* Bottom: Menu Container */}
                  <div className="bg-white rounded-t-[16px] overflow-hidden flex flex-col flex-1 shadow-sm pb-32">'''

replacement2 = '''                  {/* Bottom: Menu Container */}
                  <div className="bg-white rounded-[24px] overflow-hidden flex flex-col shadow-sm mb-6">'''

content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
