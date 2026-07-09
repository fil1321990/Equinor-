const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// For USDT
code = code.replace(
  /setIsProcessing\(true\);\s*const \{ success \} = await requestDeposit\(amt, finalReference, \{ bankName: 'USDT', accountNumber: 'TRC20 Wallet', accountName: 'Equinor USDT' \}, currentUser\?\.bankDetails\);\s*if \(!success\) \{\s*setIsProcessing\(false\);\s*return;\s*\}\s*setPaymentProcessingState\(\{ step: 1, message: "Verifying transaction on the blockchain\.\.\." \}\);/,
  `setIsProcessing(true);
                      setPaymentProcessingState({ step: 1, message: "Verifying transaction on the blockchain..." });
                      const { success } = await requestDeposit(amt, finalReference, { bankName: 'USDT', accountNumber: 'TRC20 Wallet', accountName: 'Equinor USDT' }, currentUser?.bankDetails);
                      if (!success) {
                        setPaymentProcessingState(null);
                        setIsProcessing(false);
                        return;
                      }`
);

// For Fiat
code = code.replace(
  /setIsProcessing\(true\);\s*const targetAccount = systemDepositAccounts\[depositCheckoutAccountIndex % systemDepositAccounts\.length\];\s*const \{ success \} = await requestDeposit\(amt, finalReference, targetAccount, currentUser\?\.bankDetails\);\s*if \(!success\) \{\s*setIsProcessing\(false\);\s*return;\s*\}\s*setPaymentProcessingState\(\{ step: 1, message: "Verifying transaction with the bank\.\.\." \}\);/,
  `setIsProcessing(true);
                  setPaymentProcessingState({ step: 1, message: "Verifying transaction with the bank..." });
                  const targetAccount = systemDepositAccounts[depositCheckoutAccountIndex % systemDepositAccounts.length];
                  const { success } = await requestDeposit(amt, finalReference, targetAccount, currentUser?.bankDetails);
                  if (!success) {
                     setPaymentProcessingState(null);
                     setIsProcessing(false);
                     return;
                  }`
);

fs.writeFileSync('src/App.tsx', code);
