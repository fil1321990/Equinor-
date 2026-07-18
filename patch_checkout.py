import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

# USDT FIX
target1 = """                      setPaymentProcessingState({ step: 1, message: "Verifying transaction on the blockchain..." });
                      const { success } = await requestDeposit(amt, finalReference, { bankName: 'USDT', accountNumber: 'TRC20 Wallet', accountName: 'Equinor USDT' }, currentUser?.bankDetails);"""

replacement1 = """                      const todayTransactions = transactions.filter(t => t.userId === currentUser?.id && t.type === 'deposit' && new Date(t.date).toDateString() === new Date().toDateString());
                      const depositCount = todayTransactions.length;
                      let totalTime = 2000;
                      if (depositCount === 1) totalTime = 3000;
                      else if (depositCount === 2) totalTime = 4000;
                      else if (depositCount >= 3) totalTime = 5000;
                      const stepTime = Math.floor(totalTime / 3);

                      setPaymentProcessingState({ step: 1, message: "Verifying transaction on the blockchain..." });
                      await new Promise(r => setTimeout(r, stepTime));
                      setPaymentProcessingState({ step: 2, message: "Awaiting blockchain confirmation..." });
                      await new Promise(r => setTimeout(r, stepTime));
                      setPaymentProcessingState({ step: 3, message: "Finalizing request..." });
                      await new Promise(r => setTimeout(r, stepTime));
                      const { success } = await requestDeposit(amt, finalReference, { bankName: 'USDT', accountNumber: 'TRC20 Wallet', accountName: 'Equinor USDT' }, currentUser?.bankDetails);"""

if target1 in content:
    content = content.replace(target1, replacement1)
else:
    print("Target 1 not found")

# LOCAL DEPOSIT FIX
target2 = """                  const totalTime = Math.floor(Math.random() * 5 + 1) * 1000;
                  const stepTime = Math.floor(totalTime / 3);
                  setPaymentProcessingState({ step: 1, message: "Verifying transaction with the bank..." });"""

replacement2 = """                  const todayTransactions = transactions.filter(t => t.userId === currentUser?.id && t.type === 'deposit' && new Date(t.date).toDateString() === new Date().toDateString());
                  const depositCount = todayTransactions.length;
                  let totalTime = 2000;
                  if (depositCount === 1) totalTime = 3000;
                  else if (depositCount === 2) totalTime = 4000;
                  else if (depositCount >= 3) totalTime = 5000;
                  const stepTime = Math.floor(totalTime / 3);
                  
                  setPaymentProcessingState({ step: 1, message: "Verifying transaction with the bank..." });"""

if target2 in content:
    content = content.replace(target2, replacement2)
else:
    print("Target 2 not found")

# COLOR FIX
target3 = """          if (successAnimType === "deposit") {
            primaryColor = "#00E5FF";
            gradientStart = "#67E8F9";
            gradientEnd = "#0891B2";
            rgbColor = "0,229,255";
          } else if (successAnimType === "withdraw") {"""

replacement3 = """          if (successAnimType === "withdraw") {"""

if target3 in content:
    content = content.replace(target3, replacement3)
else:
    print("Target 3 not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Done")
