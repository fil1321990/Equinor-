const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const executeWithdrawal = async \(\) => \{[\s\S]*?try \{[\s\S]*?requestWithdrawal\(amountNum, \{[\s\S]*?\}\);[\s\S]*?setIsProcessing\(false\);[\s\S]*?setWithdrawAmount\(""\);[\s\S]*?setSuccessAnimType\("withdraw"\);[\s\S]*?setSuccessAnimTitle\("Withdrawal Requested"\);[\s\S]*?setSuccessAnimMessage\("Withdrawal request submitted! Awaiting CBN\/SEC confirmation\."\);[\s\S]*?setSuccessAnimAmount\(amountNum\);[\s\S]*?setActiveModal\("successAnimated"\);[\s\S]*?setShowConfetti\(true\);[\s\S]*?setTimeout\(\(\) => setShowConfetti\(false\), 5000\);[\s\S]*?\} catch \(err: any\) \{/m;

const replacement = `const executeWithdrawal = async () => {
    setShowWithdrawConfirm(false);
    const amountNum = Number(withdrawAmount);
    const { bankName: userBankName, accountNumber: userAccountNum, accountName: userAccountName } = currentUser!.bankDetails!;
    
    setIsProcessing(true);
    try {
      const res = await requestWithdrawal(amountNum, {
        bankName: userBankName,
        accountNumber: userAccountNum,
        accountName: userAccountName,
      });
      if (!res?.success) {
        triggerVisualNotification("alert", "Notice", res?.message || "Withdrawal failed");
        setIsProcessing(false);
        return;
      }
      setIsProcessing(false);
      setWithdrawAmount("");
      setSuccessAnimType("withdraw");
      setSuccessAnimTitle("Withdrawal Requested");
      setSuccessAnimMessage("Withdrawal request submitted! Awaiting CBN/SEC confirmation.");
      setSuccessAnimAmount(amountNum);
      setActiveModal("successAnimated");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (err: any) {`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
