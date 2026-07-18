import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                  setPaymentProcessingState({ step: 1, message: "Verifying transaction with the bank..." });
                  await new Promise(r => setTimeout(r, 1000));
                  setPaymentProcessingState({ step: 2, message: "Awaiting Bank confirmation..." });
                  await new Promise(r => setTimeout(r, 1000));
                  setPaymentProcessingState({ step: 3, message: "Finalizing request..." });
                  await new Promise(r => setTimeout(r, 1000));
                  const targetAccount = systemDepositAccounts[depositCheckoutAccountIndex % systemDepositAccounts.length];"""

replacement = """                  const totalTime = Math.floor(Math.random() * 5 + 1) * 1000;
                  const stepTime = Math.floor(totalTime / 3);
                  setPaymentProcessingState({ step: 1, message: "Verifying transaction with the bank..." });
                  await new Promise(r => setTimeout(r, stepTime));
                  setPaymentProcessingState({ step: 2, message: "Awaiting Bank confirmation..." });
                  await new Promise(r => setTimeout(r, stepTime));
                  setPaymentProcessingState({ step: 3, message: "Finalizing request..." });
                  await new Promise(r => setTimeout(r, stepTime));
                  const targetAccount = systemDepositAccounts[depositCheckoutAccountIndex % systemDepositAccounts.length];"""

if target in content:
    content = content.replace(target, replacement)
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Done")
