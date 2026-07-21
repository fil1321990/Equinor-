import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = '''    setIsProcessing(true);
    setPaymentProcessingState({ step: 1, message: "Initiating order..." });
    try {
      await new Promise(res => setTimeout(res, 800));
      setPaymentProcessingState({ step: 2, message: "Deducting balance..." });
      await new Promise(res => setTimeout(res, 800));
      setPaymentProcessingState({ step: 3, message: "Finalizing purchase..." });
      await new Promise(res => setTimeout(res, 800));

      const res = await createInvestment(planName, totalAmount, roi, days, fixedDailyReturn, tPlusDays, quantity, totalDurationDays, payoutCycleDays);
      if (res && res.success) {
        setActiveModal(null);
        triggerVisualNotification("purchase_success", "PURCHASE SUCCESSFUL", "Thank you for choosing Equinor", totalAmount);
      } else {
        triggerVisualNotification("alert", "Error", "Failed to purchase product.");
      }
    } finally {
      setIsProcessing(false);
      setPaymentProcessingState(null);
    }'''

replacement1 = '''    setIsProcessing(true);
    try {
      const res = await createInvestment(planName, totalAmount, roi, days, fixedDailyReturn, tPlusDays, quantity, totalDurationDays, payoutCycleDays);
      if (res && res.success) {
        setActiveModal("purchaseSuccess");
      } else {
        triggerVisualNotification("alert", "Error", "Failed to purchase product.");
      }
    } finally {
      setIsProcessing(false);
    }'''

target2 = '''                <button 
                  disabled={isProcessing}
                  onClick={async () => {
                    await handleInvest(equinorSelectedPlan.name, equinorSelectedPlan.buyAmount, equinorSelectedPlan.roi, equinorSelectedPlan.days || 30, equinorSelectedPlan.type, equinorSelectedPlan.fixedDailyReturn, equinorSelectedPlan.tPlusDays, Number(buyingQuantity), equinorSelectedPlan.total_duration_days || equinorSelectedPlan.days || 30, equinorSelectedPlan.payout_cycle_days || equinorSelectedPlan.tPlusDays || 1, getAudienceType(equinorSelectedPlan));
                    setOrderTab(equinorSelectedPlan.type as any);
                    setActiveTab("order");
                  }}
                  className={`flex-1 py-3 rounded-full text-white font-semibold text-[15px] shadow-sm transform transition ${isProcessing ? 'bg-gray-400 scale-[0.98]' : 'bg-[#7367F0] hover:bg-[#7367F0]/90 active:scale-95'}`}
                >'''

replacement2 = '''                <button 
                  disabled={isProcessing}
                  onClick={async () => {
                    await handleInvest(equinorSelectedPlan.name, equinorSelectedPlan.buyAmount, equinorSelectedPlan.roi, equinorSelectedPlan.days || 30, equinorSelectedPlan.type, equinorSelectedPlan.fixedDailyReturn, equinorSelectedPlan.tPlusDays, Number(buyingQuantity), equinorSelectedPlan.total_duration_days || equinorSelectedPlan.days || 30, equinorSelectedPlan.payout_cycle_days || equinorSelectedPlan.tPlusDays || 1, getAudienceType(equinorSelectedPlan));
                  }}
                  className={`flex-1 py-3 rounded-full text-white font-semibold text-[15px] shadow-sm transform transition ${isProcessing ? 'bg-gray-400 scale-[0.98]' : 'bg-[#7367F0] hover:bg-[#7367F0]/90 active:scale-95'}`}
                >'''

content = content.replace(target1, replacement1)
content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
