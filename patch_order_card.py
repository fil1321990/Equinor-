import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = '''  <div className="w-full h-[50px] rounded-[10px] overflow-hidden mb-2 bg-slate-800">'''
replacement1 = '''  <div className="w-full h-[120px] rounded-[10px] overflow-hidden mb-2 bg-slate-800">'''

content = content.replace(target1, replacement1)

target2 = '''  {/* 3-up grid: daily income, cycle, total income */}
  <div className="bg-[#E8E9FF] rounded-[10px] py-2 w-full mb-1">'''
replacement2 = '''  {/* 3-up grid: daily income, cycle, total income */}
  <div className="bg-[#E8E9FF] rounded-[10px] py-1.5 w-full mb-1">'''

content = content.replace(target2, replacement2)

target3 = '''  {/* Full single width block below the 3-up grid for Price */}
  <div className="bg-[#E8E9FF] rounded-[8px] py-2 px-3 mb-2 flex flex-col items-center justify-center text-center">'''
replacement3 = '''  {/* Full single width block below the 3-up grid for Price */}
  <div className="bg-[#E8E9FF] rounded-[8px] py-1.5 px-3 mb-2 flex flex-col items-center justify-center text-center">'''

content = content.replace(target3, replacement3)

target4 = '''  {/* 5. Profit Row */}
                            <div className="flex justify-between items-center bg-white rounded-[12px] p-[12px] shadow-sm border border-gray-100">'''
replacement4 = '''  {/* 5. Profit Row */}
                            <div className="flex justify-between items-center bg-white rounded-[12px] py-[8px] px-[12px] shadow-sm border border-gray-100">'''

content = content.replace(target4, replacement4)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
