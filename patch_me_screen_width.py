import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """              {/* Container for Layout */}
              <div className="mx-auto flex flex-col w-full px-4 self-center">
                
                {/* Account balance card */}
                <div className="bg-[#FDD835] rounded-[16px] p-4 flex flex-col relative h-[95px] overflow-hidden shadow-sm">"""

replacement = """              {/* Container for Layout */}
              <div className="mx-auto flex flex-col w-full self-center">
                
                {/* Account balance card */}
                <div className="bg-[#FDD835] rounded-none p-4 flex flex-col relative h-[95px] overflow-hidden shadow-sm">"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced layout container and account balance")
else:
    print("Target layout not found")

target_2 = """                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-[24px] p-4 flex flex-col w-full shadow-lg">
                  
                  {/* Top: Promo Card */}
                  <div 
                    className="bg-gradient-to-r from-[#8630A1] to-[#4A22D4] rounded-[16px] p-[14px] flex relative overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                  >"""

replacement_2 = """                {/* Main container */}
                <div className="bg-[#1E5BFF] rounded-none py-4 flex flex-col w-full shadow-lg">
                  
                  {/* Top: Promo Card */}
                  <div 
                    className="bg-gradient-to-r from-[#8630A1] to-[#4A22D4] rounded-none p-[14px] px-4 flex relative overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                  >"""

if target_2 in content:
    content = content.replace(target_2, replacement_2)
    print("Replaced main container and promo card")
else:
    print("Target 2 layout not found")

target_3 = """                  {/* Spacing 16px gap */}
                  <div className="h-4 w-full"></div>

                  {/* Bottom: Menu Container */}
                  <div className="bg-white rounded-[16px] overflow-hidden flex flex-col shadow-sm">"""

replacement_3 = """                  {/* Spacing 16px gap */}
                  <div className="h-4 w-full"></div>

                  {/* Bottom: Menu Container */}
                  <div className="bg-white rounded-none overflow-hidden flex flex-col shadow-sm">"""

if target_3 in content:
    content = content.replace(target_3, replacement_3)
    print("Replaced menu container")
else:
    print("Target 3 layout not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
