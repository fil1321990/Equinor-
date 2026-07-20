import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """            {/* Middle Big Logo for Products */}
            <div className="relative -top-5 flex flex-col items-center z-40 mx-2">
              <button 
                onClick={() => {
                  setActiveTab("product");
                  setActiveModal(null);
                }}
                className={`w-[56px] h-[56px] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(123,47,255,0.4)] transition-transform active:scale-95 border-[3px] border-white ${activeTab === "product" && !activeModal ? "bg-[#7B2FF7]" : "bg-[#1C0F3F]"}`}
              >
                <EquinorStar className="w-[36px] h-[36px]" />
              </button>
            </div>"""

replacement = """            <TabItem
              onClick={() => {
                setActiveTab("product");
                setActiveModal(null);
              }}
              icon={<LayoutGrid className="w-[24px] h-[24px]" style={{ strokeWidth: 2 }} />}
              label="Product"
              active={activeTab === "product" && !activeModal}
            />"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced footer tab successfully")
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
