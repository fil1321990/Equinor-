import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace('className="bg-[#E8E9FF] rounded-[8px] py-2 px-1 flex flex-col items-center justify-center text-center overflow-hidden"', 'className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-1 flex flex-col items-center justify-center text-center overflow-hidden"')

with open("src/App.tsx", "w") as f:
    f.write(content)

