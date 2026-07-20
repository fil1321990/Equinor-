import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace blue container opening
target_blue = 'className="bg-[#1E5BFF] rounded-t-[32px] pb-24 pt-6 px-4 -mx-5 -mb-20 flex flex-col w-[calc(100%+40px)] shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"'
replacement_blue = 'className="bg-[#1E5BFF] rounded-t-[32px] pt-6 px-4 -mx-5 -mb-32 flex flex-col flex-1 w-[calc(100%+40px)] min-h-[calc(100vh-250px)] shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"'

content = content.replace(target_blue, replacement_blue)

# Replace white menu container opening
target_white = '<div className="bg-white rounded-[16px] overflow-hidden flex flex-col shadow-sm">'
replacement_white = '<div className="bg-white rounded-t-[16px] overflow-hidden flex flex-col flex-1 shadow-sm pb-32">'

content = content.replace(target_white, replacement_white)

with open("src/App.tsx", "w") as f:
    f.write(content)

