import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = """                  <button onClick={() => setActiveModal("deposit")} className="bg-[#F3F0FF] rounded-[20px] h-[72px] basis-[48%] flex-grow max-w-[49%] flex flex-col items-center justify-center active:opacity-80 transition-opacity">"""
replacement1 = """                  <button onClick={() => setActiveModal("deposit")} className="bg-[#F3F0FF] rounded-[20px] h-[72px] basis-[45%] flex-grow-0 flex flex-col items-center justify-center active:opacity-80 transition-opacity mx-auto">"""

target2 = """                  <button onClick={() => setActiveModal("withdraw")} className="bg-[#F3F0FF] rounded-[20px] h-[72px] basis-[48%] flex-grow max-w-[49%] flex flex-col items-center justify-center active:opacity-80 transition-opacity">"""
replacement2 = """                  <button onClick={() => setActiveModal("withdraw")} className="bg-[#F3F0FF] rounded-[20px] h-[72px] basis-[45%] flex-grow-0 flex flex-col items-center justify-center active:opacity-80 transition-opacity mx-auto">"""

content = content.replace(target1, replacement1)
content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Done")
