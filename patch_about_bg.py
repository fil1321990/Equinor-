import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''        {activeModal === "about" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4">
            <div className="bg-[#0B1B3D] border border-white/10 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] w-full relative shadow-2xl max-h-[92vh] flex flex-col">'''

replacement = '''        {activeModal === "about" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4">
            <div className="bg-[#0A0E2E] border border-white/10 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] w-full relative shadow-2xl max-h-[92vh] flex flex-col">'''

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
