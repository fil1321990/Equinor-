const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf-8');

// Find all occurrences where a function returns or resolves after supabase mutation, and add globalMutate('appData')
// Easiest is to inject it at the end of these functions.
const fnsToMutate = [
  "const requestDeposit =",
  "const requestWithdrawal =",
  "const createInvestment =",
  "const approveTransaction =",
  "const rejectTransaction =",
  "const adminUpdateUserBalance =",
  "const collectEarnings =",
  "const claimTask ="
];

code = code.replace(/return \{ success: true \};\n  \};\n\n  const approveTransaction =/g, "globalMutate('appData');\n    return { success: true };\n  };\n\n  const approveTransaction =");
code = code.replace(/return \{ success: true \};\n  \};\n\n  const requestWithdrawal =/g, "globalMutate('appData');\n    return { success: true };\n  };\n\n  const requestWithdrawal =");
code = code.replace(/return \{ success: true \};\n  \};\n\n  const createInvestment =/g, "globalMutate('appData');\n    return { success: true };\n  };\n\n  const createInvestment =");
code = code.replace(/alert\("Transaction rejected successfully"\);\n  \};/g, "alert(\"Transaction rejected successfully\");\n    globalMutate('appData');\n  };");
code = code.replace(/alert\("Transaction approved successfully"\);\n  \};/g, "alert(\"Transaction approved successfully\");\n    globalMutate('appData');\n  };");
code = code.replace(/if \(totalToAdd > 0\) \{\n        await supabase.from\('incomeRecords'\).insert\(\{[\s\S]*?\}\);\n      \}\n    \} catch \(err\) \{\n      console.error\(err\);\n    \}/g, "$&\n    globalMutate('appData');");
code = code.replace(/await supabase.from\('users'\).update\(\{ balance: newBalance, claimedTasks: newTasks \}\).eq\('id', currentUser.id\);\n  \};/g, "$&\n    globalMutate('appData');");
code = code.replace(/await supabase.from\('users'\).update\(\{ balance: newBalance \}\).eq\('id', userId\);\n  \};/g, "$&\n    globalMutate('appData');");

fs.writeFileSync('src/store.tsx', code);
console.log("Added globalMutate.");
