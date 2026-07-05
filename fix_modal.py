import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Let's search for the modal string
# The modal has "Purchase Success" in it
# I'll just write a script that replaces the whole section using index

start_idx = content.find('{activeModal === "visualNotification" && (')
end_idx = content.find('{activeModal === "prizeDraw" && (')

if start_idx != -1 and end_idx != -1:
    modal_str = content[start_idx:end_idx]
    
    new_modal_str = '''{activeModal === "visualNotification" && (
          <div 
            className={`absolute inset-0 z-[100] flex flex-col items-center justify-center p-4 transition-opacity duration-200 ${notificationData.type === 'purchase_success' ? 'bg-[#0B0E2B]/60 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'}`} 
            onClick={() => {
              setActiveModal(null);
              if (notificationData.type === 'purchase_success') {
                setOrderTab("general");
                setActiveTab("order");
              }
            }}
          >
            {notificationData.type === 'purchase_success' ? (
              <div 
                className="relative w-full max-w-[340px] rounded-[24px] bg-gradient-to-b from-[#FFF0F5] to-[#FFFAFC] border-[2px] border-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex flex-col items-center pt-8 pb-6 px-6 animate-in zoom-in-95 duration-300"
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

                   <div className="w-16 h-16 rounded-full bg-[#EC4899] flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                     <Check className="w-8 h-8 text-white stroke-[3]" />
                   </div>
                </div>

                <h2 className="text-[20px] font-semibold text-[#1A1A1A] mt-4 mb-2">Purchase Success</h2>
                
                <div className="text-[18px] font-semibold text-[#EC4899] mb-6">
                   ₦{notificationData.amount ? notificationData.amount.toFixed(2) : "0.00"}
                </div>
                
                <button 
                   onClick={() => {
                     setActiveModal(null);
                     setOrderTab("general");
                     setActiveTab("order");
                   }}
                   className="w-full h-12 rounded-[24px] bg-gradient-to-r from-[#EC4899] to-[#F43F5E] text-white text-[16px] font-semibold shadow-[0_4px_12px_rgba(236,72,153,0.3)] transition-transform active:scale-95 z-10 relative"
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
        )}
        
        '''

    content = content[:start_idx] + new_modal_str + content[end_idx:]
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Modal successfully updated.")
else:
    print("Could not find start or end index.")

