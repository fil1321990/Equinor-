with open('src/App.tsx', 'r') as f:
    content = f.read()

old_onScan = """                      onScan={async (data: any) => {
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
                      }}"""

new_onScan = """                      onScan={async (data: any) => {
                        if (data && data.text) {
                          setIsScanningQR(false);
                          setIsProcessing(true);
                          const code = data.text.toUpperCase().replace(/[^A-Z0-9]/g, '');
                          setRedemptionCode(code);
                          
                          const freshProducts = await refreshProducts() || products;
                          const freshValidCodes = freshProducts.filter(p => p.type === 'redemption_code').map(p => {
                            let claimedBy = [];
                            try { claimedBy = p.title ? JSON.parse(p.title) : []; } catch (e) { }
                            return {
                              code: p.name,
                              amount: p.min,
                              minClaims: p.days,
                              maxClaims: p.maxQuota || 1,
                              validityMinutes: p.tPlusDays || 60,
                              claimedBy,
                              createdAt: p.roi
                            };
                          });
                          
                          const found = freshValidCodes.find(c => c.code === code);
                          if (found) {
                            const isExpired = Date.now() > found.createdAt + (found.validityMinutes * 60 * 1000);
                            const isMaxedOut = found.claimedBy.length >= found.maxClaims;
                            const hasClaimed = currentUser ? found.claimedBy.includes(currentUser.id) : false;
                            
                            if (isExpired) {
                              triggerVisualNotification("try_again", "CODE EXPIRED", "This redemption code has expired");
                            } else if (isMaxedOut) {
                              triggerVisualNotification("try_again", "LIMIT REACHED", "Maximum claims limit reached");
                            } else if (hasClaimed) {
                              triggerVisualNotification("try_again", "ALREADY CLAIMED", "You have already claimed this code");
                            } else {
                              setRewardAmount(found.amount);
                              setActiveModal("redemptionReward");
                              playNotificationSound('chime');
                              setShowCongratsEffect(true);
                              setTimeout(() => setShowCongratsEffect(false), 2500);
                              const prodToUpdate = freshProducts.find(p => p.type === 'redemption_code' && p.name === code);
                              if (prodToUpdate) {
                                const newClaimedBy = [...found.claimedBy, currentUser?.id || `guest-${Date.now()}`];
                                editProduct(prodToUpdate.id, { title: JSON.stringify(newClaimedBy) });
                              }
                              setRedemptionCode("");
                            }
                          } else {
                            triggerVisualNotification("try_again", "INVALID CODE", "Please check your code and try again");
                          }
                          setIsProcessing(false);
                        }
                      }}"""

content = content.replace(old_onScan, new_onScan)

with open('src/App.tsx', 'w') as f:
    f.write(content)
