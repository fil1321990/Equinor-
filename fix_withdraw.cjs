const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const regex = /const requestWithdrawal = async \([\s\S]*?bankDetails: \{ bankName: string; accountNumber: string; accountName\?: string \},\n  \) => \{[\s\S]*?if \(!currentUser\) return;[\s\S]*?if \(currentUser\.withdrawalRestricted\) \{[\s\S]*?alert\("Withdrawals are temporarily restricted for this account\."\);[\s\S]*?return;[\s\S]*?\}[\s\S]*?if \(amount > currentUser\.balance\) \{[\s\S]*?alert\("Insufficient balance"\);[\s\S]*?return;[\s\S]*?\}[\s\S]*?const \{ error \} = await supabase\.from\('users'\)\.update\(\{ balance: currentUser\.balance - amount \}\)\.eq\('id', currentUser\.id\);[\s\S]*?if \(error\) \{[\s\S]*?alert\("Withdrawal failed"\);[\s\S]*?return;[\s\S]*?\}/;

const replacement = `const requestWithdrawal = async (
    amount: number,
    bankDetails: { bankName: string; accountNumber: string; accountName?: string },
  ): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser) return { success: false, message: "Not logged in" };
    if (currentUser.withdrawalRestricted) {
      return { success: false, message: "Withdrawals are temporarily restricted for this account." };
    }
    if (amount > currentUser.balance) {
      return { success: false, message: "Insufficient balance" };
    }
    const { error } = await supabase.from('users').update({ balance: currentUser.balance - amount }).eq('id', currentUser.id);
    if (error) {
       return { success: false, message: "Withdrawal failed" };
    }`;

code = code.replace(regex, replacement);

const returnRegex = /setTransactions\(\(prev\) => \[tempTx, \.\.\.prev\]\);\n\n    const newTx = \{[\s\S]*?if \(insertErr\) console\.error\("requestWithdrawal insert err:", insertErr\);\n  \};/;
const returnReplacement = `setTransactions((prev) => [tempTx, ...prev]);

    const newTx = {
      userId: currentUser.id,
      type: "withdrawal" as TransactionType,
      amount,
      status: "pending" as TransactionStatus,
      bankDetails,
    };
    const { error: insertErr } = await supabase.from('transactions').insert(newTx);
    if (insertErr) console.error("requestWithdrawal insert err:", insertErr);
    return { success: true };
  };`;
code = code.replace(returnRegex, returnReplacement);

fs.writeFileSync('src/store.tsx', code);
