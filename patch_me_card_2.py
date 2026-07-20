import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = 'className="bg-[#1E5BFF] rounded-[32px] pb-4 pt-6 px-4 -mx-5 mb-24 flex flex-col w-[calc(100%+40px)] shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"'
replacement = 'className="bg-[#1E5BFF] rounded-t-[32px] pb-6 pt-6 px-4 -mx-5 mb-0 flex flex-col w-[calc(100%+40px)] shadow-[0_-4px_20px_rgba(0,0,0,0.15)] min-h-[calc(100vh-320px)]"'

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

