import sys
import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = 'className="bg-[#1E5BFF] rounded-t-[32px] pb-[136px] pt-6 px-4 -mx-5 -mb-32 flex flex-col w-[calc(100%+40px)] shadow-[0_-4px_20px_rgba(0,0,0,0.15)] min-h-[calc(100vh-300px)]"'
replacement = 'className="bg-[#1E5BFF] rounded-[32px] pb-4 pt-6 px-4 -mx-5 mb-24 flex flex-col w-[calc(100%+40px)] shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"'

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

