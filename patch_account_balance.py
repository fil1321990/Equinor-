import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                {/* Account balance card */}
                <div className="bg-[#FDD835] rounded-[16px] p-4 flex flex-col relative h-[95px] overflow-hidden shadow-sm">"""

replacement = """                {/* Account balance card */}
                <div className="bg-[#FDD835] rounded-[32px] w-[90%] mx-auto p-4 px-6 flex flex-col relative h-[95px] overflow-hidden shadow-sm">"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced account balance card successfully")
else:
    print("Target account balance card not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
