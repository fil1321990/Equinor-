import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''        {activeModal === "about" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-white/10 p-6 rounded-[2rem] w-full max-w-sm relative shadow-2xl max-h-[90vh] flex flex-col">
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white/50 hover:text-white"
              >
                <X size={18} />
              </button>
              <h3 className="text-[23px] font-bold mb-4 text-white text-center">About Us</h3>
              
              <div className="w-full h-40 rounded-xl mb-4 overflow-hidden relative flex-shrink-0">
                <div className="absolute inset-0 bg-[#3B82F6] blur-[20px] opacity-20"></div>
                <img 
                  src={aboutUsImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Equinor_logo.svg/1024px-Equinor_logo.svg.png"}
                  alt="Equinor" 
                  className="w-full h-full object-contain relative z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>'''

replacement = '''        {activeModal === "about" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[#0F172A] border border-white/10 p-6 rounded-[2rem] w-full max-w-sm relative shadow-2xl max-h-[90vh] flex flex-col">
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white/50 hover:text-white"
              >
                <X size={18} />
              </button>
              <h3 className="text-[23px] font-bold mb-4 text-white text-center">About Us</h3>
              
              <div className="w-full h-40 mb-4 overflow-hidden relative flex-shrink-0">
                <img 
                  src={aboutUsImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Equinor_logo.svg/1024px-Equinor_logo.svg.png"}
                  alt="Equinor" 
                  className="w-full h-full object-contain relative z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>'''

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)

