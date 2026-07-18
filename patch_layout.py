import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = """              {/* Container for Layout */}
              <div className="mx-auto flex flex-col w-full self-center">"""

replacement1 = """              {/* Container for Layout */}
              <div className="mx-auto flex flex-col w-full self-center px-4">"""

target2 = """                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-[24px] py-4 flex flex-col w-full shadow-lg">"""

replacement2 = """                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-[24px] py-4 px-4 flex flex-col w-[calc(100%+32px)] -ml-4 shadow-lg">"""

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Replaced target1")
else:
    print("Target1 not found")

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Replaced target2")
else:
    print("Target2 not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
