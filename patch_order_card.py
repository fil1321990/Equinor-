import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''<div key={inv.id} className="relative bg-[#F8F9FF] rounded-[16px] mb-3 shadow-sm p-4 w-full">
  {/* 1. Full-width hero image */}
  <div className="w-full h-[80px] rounded-[12px] overflow-hidden mb-3 bg-slate-800">'''

replacement = '''<div key={inv.id} className="relative bg-[#F8F9FF] rounded-[16px] mb-3 shadow-sm p-3 w-full">
  {/* 1. Full-width hero image */}
  <div className="w-full h-[50px] rounded-[10px] overflow-hidden mb-2 bg-slate-800">'''

content = content.replace(target, replacement)

target2 = '''  {/* 4. 4 stat pills */}
  <div className="grid grid-cols-4 gap-[4px] mb-4">'''

replacement2 = '''  {/* 4. 4 stat pills */}
  <div className="grid grid-cols-4 gap-[4px] mb-2">'''

content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)

