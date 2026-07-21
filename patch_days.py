import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''          {daysLeft > 0 && (
            <div className="text-[#1A1A1A] font-black text-[13px] mr-1">
              {daysLeft} Day
            </div>
          )}'''

replacement = '''          {daysLeft > 0 && (
            <>
              <div className="bg-black text-white rounded-[8px] px-2 min-w-[36px] h-[32px] flex items-center justify-center font-black text-[14px] shadow-sm tracking-wider">
                {daysLeft}
              </div>
              <div className="text-[#1A1A1A] font-black text-[13px] mx-1">
                Day
              </div>
            </>
          )}'''

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)

