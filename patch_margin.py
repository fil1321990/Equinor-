import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = """                  {/* Summary Cards outside scroll */}
                  <div className="flex gap-2 mb-3 shrink-0 z-10 w-full mt-2">"""
replacement1 = """                  {/* Summary Cards outside scroll */}
                  <div className="flex gap-2 mb-1 shrink-0 z-10 w-full mt-1">"""

target2 = """                      className={`w-full py-2.5 rounded-[12px] font-bold text-[14px] mb-3 shrink-0 z-10 shadow-md transition-transform flex justify-center items-center ${isProcessing ? 'opacity-80 scale-[0.98]' : ''} ${totalCanBeCollected > 0 ? 'bg-[#7B2FFF] text-white active:scale-[0.98]' : 'bg-[#7B2FFF]/50 text-white/80 active:scale-[1]'}`}"""
replacement2 = """                      className={`w-full py-2.5 rounded-[12px] font-bold text-[14px] mb-1 shrink-0 z-10 shadow-md transition-transform flex justify-center items-center ${isProcessing ? 'opacity-80 scale-[0.98]' : ''} ${totalCanBeCollected > 0 ? 'bg-[#7B2FFF] text-white active:scale-[0.98]' : 'bg-[#7B2FFF]/50 text-white/80 active:scale-[1]'}`}"""

target3 = """                  {/* Tab Navigation */}
                  <div className="px-1 shrink-0 mb-4 mt-1 w-full">"""
replacement3 = """                  {/* Tab Navigation */}
                  <div className="px-1 shrink-0 mb-2 mt-1 w-full">"""

content = content.replace(target1, replacement1)
content = content.replace(target2, replacement2)
content = content.replace(target3, replacement3)

with open("src/App.tsx", "w") as f:
    f.write(content)
