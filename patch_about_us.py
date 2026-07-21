import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''        {activeModal === "about" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[#141a3a] border border-white/10 p-6 rounded-[2rem] w-full max-w-sm relative shadow-2xl max-h-[90vh] flex flex-col">
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white/50 hover:text-white"
              >
                <X size={18} />
              </button>
              <h3 className="text-xl font-bold mb-4 text-[#00D4FF]">About Us</h3>
              
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
              </div>

              <div className="text-white/80 text-sm space-y-3 leading-relaxed overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-0">
                <p><strong>Company Name:</strong> Equinor ASA (Stock Code: EQNR)</p>
                <p>Equinor was founded in 1972, and its headquarters is located in Stavanger, Norway. It is the largest oil and gas operator on the Norwegian Continental Shelf (NCS) and one of the world's leading offshore oil, gas, and integrated energy companies.</p>
                <p>The company operates in more than 30 countries and its business spans various sectors including Conventional oil & natural gas, Offshore Wind, Floating Wind, Carbon Capture & Storage (CCS), Hydrogen fuel, Energy Storage, etc.</p>
                <div className="pt-4 mt-4 border-t border-white/10">
                  <p className="italic font-medium text-[#00D4FF] mb-2 text-base text-center leading-snug">"Energy for people.<br/>Progress for society.<br/>Searching for better."</p>
                  <p className="text-xs text-white/60 text-center">To supply energy for people, contribute to societal development, and search for better energy solutions.</p>
                </div>'''

replacement = '''        {activeModal === "about" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-gradient-to-b from-[#3b0a45] to-[#041133] border border-white/10 p-6 rounded-[2rem] w-full max-w-sm relative shadow-2xl max-h-[90vh] flex flex-col">
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white/50 hover:text-white"
              >
                <X size={18} />
              </button>
              <h3 className="text-[23px] font-bold mb-4 text-white">About Us</h3>
              
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
              </div>

              <div className="text-cyan-100 text-[14.5px] space-y-3 leading-relaxed overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-0">
                <p><strong>Company Name:</strong> <span className="text-yellow-400 text-[17.5px] font-bold">Equinor ASA (Stock Code: EQNR)</span></p>
                <p>Equinor was founded in 1972, and its headquarters is located in Stavanger, Norway. It is the largest oil and gas operator on the Norwegian Continental Shelf (NCS) and one of the world's leading offshore oil, gas, and integrated energy companies.</p>
                <p>The company operates in more than 30 countries and its business spans various sectors including Conventional oil & natural gas, Offshore Wind, Floating Wind, Carbon Capture & Storage (CCS), Hydrogen fuel, Energy Storage, etc.</p>
                <div className="pt-4 mt-4 border-t border-white/10">
                  <p className="italic font-medium text-yellow-300 mb-2 text-base text-center leading-snug">"Energy for people.<br/>Progress for society.<br/>Searching for better."</p>
                  <p className="text-xs text-cyan-200 text-center">To supply energy for people, contribute to societal development, and search for better energy solutions.</p>
                </div>'''

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
