import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target_container = """              {/* Container for Layout */}
              <div className="mx-4 flex flex-col max-w-[400px] w-full self-center">"""

replacement_container = """              {/* Container for Layout */}
              <div className="mx-auto flex flex-col max-w-[400px] w-[calc(100%-2rem)] self-center">"""

if target_container in content:
    content = content.replace(target_container, replacement_container)
    print("Replaced layout container")
else:
    print("Layout container not found")


target_button = """                    <button
                      className="bg-[#FF4FA3] text-white px-2 h-[32px] rounded-[16px] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center active:scale-95 transition-transform w-[180px] shadow-sm border-none z-10 relative"
                      onClick={() => setActiveModal("redemptionCode")}
                    >
                      Check presents
                    </button>"""

replacement_button = """                    <button
                      className="bg-[#FF4FA3] text-white px-4 h-[36px] rounded-[18px] text-[10px] font-bold uppercase tracking-wider flex items-center justify-center active:scale-95 transition-transform w-[300px] max-w-[95%] shadow-sm border-none z-10 relative text-center leading-tight"
                      onClick={() => setActiveModal("redemptionCode")}
                    >
                      Rescue presents of great value with a click
                    </button>"""

if target_button in content:
    content = content.replace(target_button, replacement_button)
    print("Replaced button text and width")
else:
    print("Target button not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
