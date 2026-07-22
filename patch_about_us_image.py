import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''              <div className="w-full h-40 mb-4 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                <img 
                  src={aboutUsImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Equinor_logo.svg/1024px-Equinor_logo.svg.png"}
                  alt="Equinor" 
                  className="w-full h-full object-contain relative z-10 rounded-[2rem]"'''

replacement = '''              <div className="w-full h-28 mb-4 overflow-hidden relative flex-shrink-0 flex items-center justify-center bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-4">
                <img 
                  src={aboutUsImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Equinor_logo.svg/1024px-Equinor_logo.svg.png"}
                  alt="Equinor" 
                  className="w-full h-full object-contain relative z-10"'''

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
