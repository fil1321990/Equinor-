import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. About us card background and image container shape
target1 = '''        {activeModal === "about" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4">
            <div className="bg-[#0A0E2E] border border-white/10 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] w-full relative shadow-2xl max-h-[92vh] flex flex-col">
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white/50 hover:text-white"
              >
                <X size={18} />
              </button>
              <h3 className="text-[23px] font-bold mb-4 text-white text-center">About Us</h3>
              
              <div className="w-full h-28 mb-4 overflow-hidden relative flex-shrink-0 flex items-center justify-center bg-white/5 border border-white/20 rounded-xl p-4">'''

replacement1 = '''        {activeModal === "about" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4">
            <div className="bg-[#0B1B3D] border border-white/10 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] w-full relative shadow-2xl max-h-[92vh] flex flex-col">
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white/50 hover:text-white"
              >
                <X size={18} />
              </button>
              <h3 className="text-[23px] font-bold mb-4 text-white text-center">About Us</h3>
              
              <div className="w-full h-28 mb-4 overflow-hidden relative flex-shrink-0 flex items-center justify-center bg-white/5 border border-white/20 rounded-[2rem] p-4">'''

content = content.replace(target1, replacement1)

# 2. Reduce the height of the menus card items
target2 = '''                        key={index}
                        onClick={item.action}
                        className={`flex items-center justify-between px-4 py-[14px] cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-black ${'''

replacement2 = '''                        key={index}
                        onClick={item.action}
                        className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-black ${'''

content = content.replace(target2, replacement2)

# 3. Reduce height of the logout button
target3 = '''                    {/* Log Out Button */}
                    <div
                      onClick={logout}
                      className="flex items-center justify-between px-4 py-[14px] cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-red-500 border-t border-[#F5F5F5]"
                    >'''

replacement3 = '''                    {/* Log Out Button */}
                    <div
                      onClick={logout}
                      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-red-500 border-t border-[#F5F5F5]"
                    >'''

content = content.replace(target3, replacement3)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
