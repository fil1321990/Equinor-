import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """              {/* Stepper */}
              <div className="w-full flex items-center justify-between py-6 relative z-10">"""
replacement = """              {/* Stepper */}
              <div className="w-full flex items-center justify-between py-3 relative z-10">"""
content = content.replace(target, replacement)

target2 = """              {/* Tier Badge Hero */}
              <div className="relative w-full py-4 flex flex-col items-center justify-center mb-4">
                <div className="absolute w-[160px] h-[160px] bg-[#E91E63]/40 blur-[20px] rounded-full mix-blend-screen -z-10" />
                <RankBadge rankName={currentVipLevel.name} size={160} />
              </div>
              </div>

              {/* Body area */}
              <div className="w-full px-6 pb-8 flex flex-col items-center -mt-[45px] relative z-20">
              {/* Status Card */}
              <div className="w-full bg-gradient-to-br from-[#FFD54F] to-[#FFB300] rounded-[16px] p-4 shadow-xl relative overflow-hidden mb-6">
                
                <div className="flex items-center gap-4 mb-5 relative z-10">
                  <button 
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    className="w-12 h-12 rounded-full border-2 border-white/50 bg-black/10 flex shrink-0 items-center justify-center shadow-sm overflow-hidden relative cursor-pointer"
                  >"""
replacement2 = """              {/* Tier Badge Hero */}
              <div className="relative w-full py-2 flex flex-col items-center justify-center mb-2">
                <div className="absolute w-[120px] h-[120px] bg-[#E91E63]/40 blur-[20px] rounded-full mix-blend-screen -z-10" />
                <RankBadge rankName={currentVipLevel.name} size={120} />
              </div>
              </div>

              {/* Body area */}
              <div className="w-full px-6 pb-2 flex flex-col items-center -mt-[40px] relative z-20">
              {/* Status Card */}
              <div className="w-full bg-gradient-to-br from-[#FFD54F] to-[#FFB300] rounded-[16px] p-3 shadow-xl relative overflow-hidden mb-4">
                
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <button 
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    className="w-10 h-10 rounded-full border-2 border-white/50 bg-black/10 flex shrink-0 items-center justify-center shadow-sm overflow-hidden relative cursor-pointer"
                  >"""
content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Done")
