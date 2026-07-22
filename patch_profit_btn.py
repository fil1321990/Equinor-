import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = '''                                  className={`bg-[#FF4444] text-white px-8 py-2 rounded-[24px] font-semibold text-[16px] ${stagedCollections.includes(inv.id) ? 'opacity-80 scale-95' : 'active:scale-95'}`}'''
replacement1 = '''                                  className={`bg-[#FF4444] text-white px-8 py-1.5 rounded-[24px] font-semibold text-[15px] ${stagedCollections.includes(inv.id) ? 'opacity-80 scale-95' : 'active:scale-95'}`}'''
content = content.replace(target1, replacement1)

target2 = '''                                <div className="bg-[#E8E9FF] text-[#A0A0A0] px-8 py-2 rounded-[24px] font-semibold text-[16px]">'''
replacement2 = '''                                <div className="bg-[#E8E9FF] text-[#A0A0A0] px-8 py-1.5 rounded-[24px] font-semibold text-[15px]">'''
content = content.replace(target2, replacement2)

target3 = '''                                <button className="bg-[#E8E9FF] text-[#A0A0A0] px-8 py-2 rounded-[24px] font-semibold text-[16px] cursor-not-allowed">'''
replacement3 = '''                                <button className="bg-[#E8E9FF] text-[#A0A0A0] px-8 py-1.5 rounded-[24px] font-semibold text-[15px] cursor-not-allowed">'''
content = content.replace(target3, replacement3)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
