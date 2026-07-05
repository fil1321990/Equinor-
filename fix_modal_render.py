import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_modal = '''        {activeModal === "visualNotification" && (
          <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-200" onClick={() => {
            setActiveModal(null);
            if (notificationData.type === 'purchase_success') {
              setTimeout(() => setActiveModal("prizeDraw"), 50);
            }
          }}>
            <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
              <img 
                src={
                  notificationData.type === 'purchase_success' ? imgPurchaseSuccess :
                  notificationData.type === 'reward_unlocked' ? imgRewardUnlocked :
                  notificationData.type === 'you_won' ? imgYouWon :
                  notificationData.type === 'try_again' ? imgTryAgain :
                  imgInsufficientBalance
                } 
                className="w-full h-full object-cover select-none pointer-events-none absolute inset-0" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#B20F24]/80 via-transparent to-black/30 pointer-events-none" />
              
              <button 
                onClick={() => {
                  setActiveModal(null);
                  if (notificationData.type === 'purchase_success') {
                    setTimeout(() => setActiveModal("prizeDraw"), 50);
                  }
                }}
                className="absolute top-4 right-4 bg-black/40 hover:bg-[#B20F24] text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur transition-colors"
                style={{ zIndex: 10 }}
              >
                ✕
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 w-full shadow-lg">
                  <h3 className="text-white font-bold text-[22px] tracking-wide mb-1 drop-shadow-md">
                    {notificationData.title}
                  </h3>
                  <p className="text-white/90 text-[15px] font-medium leading-snug drop-shadow-sm">
                    {notificationData.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}'''

new_modal = '''        {activeModal === "visualNotification" && (
          <div 
            className={`absolute inset-0 z-[100] flex flex-col items-center justify-center p-4 transition-opacity duration-200 ${notificationData.type === 'purchase_success' ? 'bg-[#0B0E2B]/60 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'}`} 
            onClick={() => {
              setActiveModal(null);
              if (notificationData.type === 'purchase_success') {
                setTimeout(() => setActiveModal("prizeDraw"), 50);
              }
            }}
          >
            {notificationData.type === 'purchase_success' ? (
              <div 
                className="relative w-full max-w-[340px] rounded-[24px] bg-gradient-to-b from-[#F0EFFF] to-[#F8F7FF] border-[2px] border-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex flex-col items-center pt-8 pb-6 px-6 animate-in zoom-in-95 duration-300"
                onClick={e => e.stopPropagation()}
              >
                <div className="absolute inset-0 overflow-hidden rounded-[24px] pointer-events-none">
                  <Confetti width={340} height={400} recycle={false} numberOfPieces={150} colors={['#FFB3D9', '#7FE7FF', '#D9B3FF', '#FF6B6B']} />
                </div>
                
                <div className="relative mb-4 mt-2">
                   <div className="absolute w-4 h-4 bg-[#FFB3D9] -top-2 -left-4 rotate-12 rounded-sm" />
                   <div className="absolute w-5 h-5 bg-[#7FE7FF] -bottom-2 -left-6 -rotate-12 rounded-sm" />
                   <div className="absolute w-4 h-4 bg-[#D9B3FF] -top-1 -right-5 rotate-45 rounded-sm" />
                   <div className="absolute w-4 h-4 bg-[#FF6B6B] -bottom-3 -right-3 -rotate-12 rounded-sm" />

                   <div className="w-16 h-16 rounded-full bg-[#5B5FEF] flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(91,95,239,0.4)]">
                     <Check className="w-8 h-8 text-white stroke-[3]" />
                   </div>
                </div>

                <h2 className="text-[20px] font-semibold text-[#1A1A1A] mt-4 mb-2">Purchase Success</h2>
                
                <div className="text-[18px] font-semibold text-[#FF4444] mb-6">
                   ₦{notificationData.amount ? notificationData.amount.toFixed(2) : "0.00"}
                </div>
                
                <button 
                   onClick={() => {
                     setActiveModal(null);
                     setTimeout(() => setActiveModal("prizeDraw"), 50);
                   }}
                   className="w-full h-12 rounded-[24px] bg-gradient-to-b from-[#4B5FFF] to-[#3B5BFF] text-white text-[16px] font-semibold shadow-[0_4px_12px_rgba(59,91,255,0.3)] transition-transform active:scale-95 z-10 relative"
                >
                  Confirm
                </button>
              </div>
            ) : (
              <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                <img 
                  src={
                    notificationData.type === 'reward_unlocked' ? imgRewardUnlocked :
                    notificationData.type === 'you_won' ? imgYouWon :
                    notificationData.type === 'try_again' ? imgTryAgain :
                    imgInsufficientBalance
                  } 
                  className="w-full h-full object-cover select-none pointer-events-none absolute inset-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#B20F24]/80 via-transparent to-black/30 pointer-events-none" />
                
                <button 
                  onClick={() => {
                    setActiveModal(null);
                  }}
                  className="absolute top-4 right-4 bg-black/40 hover:bg-[#B20F24] text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur transition-colors"
                  style={{ zIndex: 10 }}
                >
                  ✕
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center text-center">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 w-full shadow-lg">
                    <h3 className="text-white font-bold text-[22px] tracking-wide mb-1 drop-shadow-md">
                      {notificationData.title}
                    </h3>
                    <p className="text-white/90 text-[15px] font-medium leading-snug drop-shadow-sm">
                      {notificationData.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}'''

if old_modal in content:
    content = content.replace(old_modal, new_modal)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Modal successfully updated")
else:
    print("Could not find the exact old modal block. I will try a regex.")
    import re
    new_content = re.sub(r'\{activeModal === "visualNotification" && \(\s*<div.*?\{notificationData\.subtitle\}\s*</p>\s*</div>\s*</div>\s*</div>\s*</div>\s*\)\}', new_modal, content, flags=re.DOTALL)
    if new_content != content:
        with open('src/App.tsx', 'w') as f:
            f.write(new_content)
        print("Updated via regex")
    else:
        print("Still failed to find modal block")

