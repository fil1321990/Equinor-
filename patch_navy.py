import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = """          {activeTab === "mine" && (
            <div className="pb-6 relative z-10 w-full">"""

replacement1 = """          {activeTab === "mine" && (
            <div className="pb-0 relative z-10 w-full">"""

target2 = """                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-[32px] pb-6 pt-6 px-4 mb-6 flex flex-col w-full shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">"""

replacement2 = """                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-t-[32px] pb-[136px] pt-6 px-9 -mx-5 -mb-32 flex flex-col w-[calc(100%+40px)] shadow-[0_-4px_20px_rgba(0,0,0,0.15)] min-h-[calc(100vh-300px)]">"""

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Replaced mine wrapper successfully")
else:
    print("Target1 not found")

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Replaced main container successfully")
else:
    print("Target2 not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
