import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace(
    'import Confetti from "react-confetti";',
    'import Confetti from "react-confetti";\nimport QrScanner from "react-qr-scanner";'
)

# Add isScanningQR state
content = content.replace(
    'const [copiedCode, setCopiedCode] = useState(false);',
    'const [copiedCode, setCopiedCode] = useState(false);\n  const [isScanningQR, setIsScanningQR] = useState(false);'
)

# Update Redemption Modal
old_modal_inner = """                <div className="w-full mb-6">
                  <input 
                    type="text"
                    value={redemptionCode}
                    onChange={(e) => setRedemptionCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    placeholder="Please enter the redemption code"
                    className="w-full h-12 bg-[#FFF3E0] rounded-full px-5 text-[#212121] placeholder-[#757575] font-medium text-[14px] text-center outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-inner"
                    aria-label="Redemption code input"
                    maxLength={16}
                  />
                </div>

                <button"""

new_modal_inner = """                {isScanningQR ? (
                  <div className="w-full mb-6 relative overflow-hidden rounded-2xl bg-black/10 border-2 border-white/20">
                    <QrScanner
                      delay={300}
                      style={{ width: '100%' }}
                      onError={(err: any) => {
                        console.error(err);
                        setToastMessage("Error accessing camera");
                        setIsScanningQR(false);
                      }}
                      onScan={async (data: any) => {
                        if (data && data.text) {
                          setIsScanningQR(false);
                          setIsProcessing(true);
                          setRedemptionCode(data.text);
                          const { data: rpcData, error } = await supabase.rpc('redeem_voucher', { qr_data: data.text, user_id: currentUser?.id });
                          if (error) {
                            triggerVisualNotification("try_again", "ERROR", error.message);
                          } else {
                            setToastMessage(rpcData?.message || "Voucher redeemed!");
                          }
                          setIsProcessing(false);
                          setActiveModal(null);
                        }
                      }}
                    />
                    <button 
                      onClick={() => setIsScanningQR(false)} 
                      className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="w-full mb-6 flex flex-col gap-3">
                    <input 
                      type="text"
                      value={redemptionCode}
                      onChange={(e) => setRedemptionCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                      placeholder="Please enter the redemption code"
                      className="w-full h-12 bg-[#FFF3E0] rounded-full px-5 text-[#212121] placeholder-[#757575] font-medium text-[14px] text-center outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-inner"
                      aria-label="Redemption code input"
                      maxLength={16}
                    />
                    <button
                      onClick={() => setIsScanningQR(true)}
                      className="w-full h-10 bg-white/20 hover:bg-white/30 rounded-full font-bold text-white text-[14px] transition-all flex items-center justify-center gap-2"
                    >
                      <span>📷</span> Scan QR Code
                    </button>
                  </div>
                )}

                <button"""

content = content.replace(old_modal_inner, new_modal_inner)

with open('src/App.tsx', 'w') as f:
    f.write(content)
