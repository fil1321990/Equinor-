import sys
import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''        {activeModal === "equinorConfirm" && equinorSelectedPlan && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 transition-opacity duration-200" onClick={() => setActiveModal(null)}>
            <div className="bg-white rounded-[20px] w-full max-w-[320px] flex flex-col items-center relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="w-full bg-[#1E1E2D] py-5 px-6 flex justify-between items-center text-white">
                <h3 className="font-bold text-[18px]">Confirm Purchase</h3>
                <button onClick={() => setActiveModal(null)} className="text-white/60 hover:text-white p-1">
                  ✕
                </button>
              </div>
              <div className="w-full py-6 px-6 bg-[#F9FAFB] flex flex-col space-y-4">
                {equinorSelectedPlan.description && (
                  <div className="flex flex-col space-y-1 mb-2">
                    <span className="text-gray-500 text-[12px] font-semibold uppercase tracking-wider">Description</span>
                    <span className="text-gray-800 text-[13px] leading-relaxed break-words whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-100">{equinorSelectedPlan.description}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-[14px]">Project</span>
                  <span className="text-gray-900 font-semibold text-[14px]">{equinorSelectedPlan.name}</span>
                </div>
                <div className="h-[1px] bg-gray-200 w-full" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-[14px]">Investment Amount (Unit)</span>
                  <span className="text-gray-900 font-bold text-[16px]">₦{equinorSelectedPlan.buyAmount.toLocaleString()}</span>
                </div>'''

replacement = '''        {activeModal === "equinorConfirm" && equinorSelectedPlan && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 transition-opacity duration-200" onClick={() => setActiveModal(null)}>
            <div className="bg-[#0B1B3D]/90 backdrop-blur-xl border border-white/20 rounded-[20px] w-full max-w-[320px] flex flex-col items-center relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="w-full border-b border-white/10 py-5 px-6 flex justify-between items-center text-white">
                <h3 className="font-bold text-[18px]">Confirm Purchase</h3>
                <button onClick={() => setActiveModal(null)} className="text-white/60 hover:text-white p-1 flex items-center justify-center rounded-full bg-white/5">
                  <X size={18} />
                </button>
              </div>
              <div className="w-full py-6 px-6 flex flex-col space-y-4">
                {equinorSelectedPlan.description && (() => {
                   let descText = equinorSelectedPlan.description;
                   let descColor = "";
                   try {
                     const parsed = JSON.parse(equinorSelectedPlan.description);
                     if (parsed.text !== undefined) {
                        descText = parsed.text;
                        descColor = parsed.color || "";
                     }
                   } catch(e) {}
                   if (!descText) return null;
                   return (
                    <div className="flex flex-col space-y-1 mb-2">
                      <span className="text-[#FBBF24] text-[12px] font-bold uppercase tracking-wider">Project Details</span>
                      <span className="text-[13px] leading-relaxed break-words whitespace-pre-wrap bg-white/5 p-3 rounded-lg border border-white/10" style={{ color: descColor || 'rgba(255,255,255,0.9)' }}>{descText}</span>
                    </div>
                   );
                })()}
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-[14px]">Project</span>
                  <span className="text-white font-semibold text-[14px] text-right">{equinorSelectedPlan.name}</span>
                </div>
                <div className="h-[1px] bg-white/10 w-full" />
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-[14px]">Investment Amount (Unit)</span>
                  <span className="text-white font-bold text-[16px]">₦{equinorSelectedPlan.buyAmount.toLocaleString()}</span>
                </div>'''

if target in content:
    content = content.replace(target, replacement)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Done")
else:
    print("Target not found")

