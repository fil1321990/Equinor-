import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-t-[32px] pb-24 pt-6 px-4 flex flex-col w-full shadow-[0_-4px_20px_rgba(0,0,0,0.15)] flex-1">"""

replacement = """                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-[32px] pb-6 pt-6 px-4 mb-6 flex flex-col w-full shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced main container successfully")
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
