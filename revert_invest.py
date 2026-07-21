import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = '''    setIsProcessing(true);
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

replacement1 = '''    setIsProcessing(true);
    try {
      const res = await createInvestment(planName, totalAmount, roi, days, fixedDailyReturn, tPlusDays, quantity, totalDurationDays, payoutCycleDays);
      if (res && res.success) {
        setActiveModal(null);
        triggerVisualNotification("purchase_success", "PURCHASE SUCCESSFUL", "Thank you for choosing Equinor", totalAmount);
      } else {
        triggerVisualNotification("alert", "Error", "Failed to purchase product.");
      }
    } finally {
      setIsProcessing(false);
    }'''

content = content.replace(target1, replacement1)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
