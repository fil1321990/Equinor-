import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''        {activeModal === "about" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[#0F172A] border border-white/10 p-6 rounded-[2rem] w-full max-w-sm relative shadow-2xl max-h-[90vh] flex flex-col">'''

replacement = '''        {activeModal === "about" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4">
            <div className="bg-[#1D4ED8] border border-white/10 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] w-full relative shadow-2xl max-h-[92vh] flex flex-col">'''

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)

