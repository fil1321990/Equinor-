import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace(
    '<div className="bg-[#FDD835] rounded-none p-4 flex flex-col relative h-[95px] overflow-hidden shadow-sm">',
    '<div className="bg-[#FDD835] rounded-[16px] p-4 flex flex-col relative h-[95px] overflow-hidden shadow-sm">'
)

content = content.replace(
    '<div className="bg-[#1E5BFF] rounded-none py-4 flex flex-col w-full shadow-lg">',
    '<div className="bg-[#1E5BFF] rounded-[24px] py-4 flex flex-col w-full shadow-lg">'
)

content = content.replace(
    'className="bg-gradient-to-r from-[#8630A1] to-[#4A22D4] rounded-none p-[14px] px-4 flex relative overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"',
    'className="bg-gradient-to-r from-[#8630A1] to-[#4A22D4] rounded-[16px] p-[14px] px-4 flex relative overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"'
)

content = content.replace(
    '<div className="bg-white rounded-none overflow-hidden flex flex-col shadow-sm">',
    '<div className="bg-white rounded-[16px] overflow-hidden flex flex-col shadow-sm">'
)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
