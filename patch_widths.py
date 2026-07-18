import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = """                <div className="px-4 w-full">
                  {/* Account balance card */}
                  <div className="bg-[#FDD835] rounded-[32px] w-full py-3 px-6 flex flex-col relative h-[65px] justify-between overflow-hidden shadow-sm">"""

replacement1 = """                <div className="-mx-1 w-[calc(100%+8px)]">
                  {/* Account balance card */}
                  <div className="bg-[#FDD835] rounded-[24px] w-full py-3 px-5 flex flex-col relative h-[65px] justify-between overflow-hidden shadow-sm">"""

target2 = """                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-t-[32px] pb-[136px] pt-6 px-9 -mx-5 -mb-32 flex flex-col w-[calc(100%+40px)] shadow-[0_-4px_20px_rgba(0,0,0,0.15)] min-h-[calc(100vh-300px)]">"""

replacement2 = """                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-t-[32px] pb-[136px] pt-6 px-4 -mx-5 -mb-32 flex flex-col w-[calc(100%+40px)] shadow-[0_-4px_20px_rgba(0,0,0,0.15)] min-h-[calc(100vh-300px)]">"""

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Replaced account balance successfully")
else:
    print("Target1 not found")

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Replaced main container successfully")
else:
    print("Target2 not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
