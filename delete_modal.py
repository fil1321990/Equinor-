import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''        {activeModal === "purchaseSuccess" && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 transition-opacity duration-200" onClick={() => setActiveModal(null)}>
            <div className="bg-white rounded-[20px] w-full max-w-[320px] flex flex-col items-center text-center relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="w-full py-8 px-6 pb-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-[24px] font-bold text-black mb-2 tracking-[-0.02em]">Purchase Successful!</h2>
                <p className="text-gray-500 text-[14px] leading-snug">
                  Your product is now active.
                </p>
              </div>

              <div className="w-full px-6 pb-6">
                <button 
                  onClick={() => {
                     setActiveModal(null);
                     setOrderTab("general");
                     setActiveTab("order");
                  }}
                  className="w-full bg-[#EC4899] text-white py-3 rounded-[12px] font-bold active:scale-95 transition-transform text-[15px] shadow-lg"
                >
                  View Active Products
                </button>
              </div>
            </div>
          </div>
        )}'''

content = content.replace(target, "")

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
