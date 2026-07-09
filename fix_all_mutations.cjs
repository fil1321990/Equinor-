const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf-8');

const regexes = [
  /await supabase\.from\('products'\)\.insert\([\s\S]*?\n\s+return data;\n/g,
  /await supabase\.from\('products'\)\.update\([\s\S]*?\n\s+setProducts\([\s\S]*?\n/g,
  /await supabase\.from\('products'\)\.delete\([\s\S]*?\n\s+setProducts\([\s\S]*?\n/g,
  /await supabase\.from\('app_settings'\)\.upsert\([\s\S]*?\n\s+const \{ error/g,
  /await supabase\.from\('users'\)\.update\(\{ disabled: true \}\)\.eq\('id', userId\);\n/g,
  /await supabase\.from\('users'\)\.update\(\{ disabled: false \}\)\.eq\('id', userId\);\n/g,
  /await supabase\.from\('users'\)\.update\(\{ withdrawalRestricted: restricted \}\)\.eq\('id', userId\);\n/g,
  /await supabase\.from\('users'\)\.update\(\{ bankDetails: details \}\)\.eq\('id', currentUser\.id\);\n/g,
  /await supabase\.from\('users'\)\.update\(\{ avatar: avatarBase64 \}\)\.eq\('id', currentUser\.id\);\n/g,
  /await supabase\.from\('users'\)\.update\(\{ phone \}\)\.eq\('id', currentUser\.id\);\n/g,
  /await supabase\.from\('users'\)\.update\(\{ password, mustChangePassword: false \}\)\.eq\('id', currentUser\.id\);\n/g,
  /await supabase\.from\('users'\)\.update\(\{ balanceAlertThreshold: threshold \}\)\.eq\('id', currentUser\.id\);\n/g,
  /await supabase\.from\('users'\)\.update\(\{ password: passwordValue, mustChangePassword: !!passwordValue \}\)\.eq\('id', userId\);\n/g,
  /await supabase\.from\('users'\)\.update\(\{ vipLevelIndex: newVipLevel \}\)\.eq\('id', currentUser\.id\);\n/g,
  /await supabase\.from\('system_deposit_accounts'\)\.insert\(account\);\n/g,
  /await supabase\.from\('system_deposit_accounts'\)\.update\(account\)\.eq\('id', id\);\n/g,
  /await supabase\.from\('system_deposit_accounts'\)\.delete\(\)\.eq\('id', id\);\n/g,
  /await supabase\.from\('users'\)\.update\(\{ balance: u\.balance \+ amount \}\)\.eq\('id', currentUser\.id\);\n/g
];

code = code.replace(/await supabase\.from\('users'\)\.update\(\{ disabled: true \}\)\.eq\('id', userId\);/g, "$&\n    globalMutate('appData');");
code = code.replace(/await supabase\.from\('users'\)\.update\(\{ disabled: false \}\)\.eq\('id', userId\);/g, "$&\n    globalMutate('appData');");
code = code.replace(/await supabase\.from\('users'\)\.update\(\{ withdrawalRestricted: restricted \}\)\.eq\('id', userId\);/g, "$&\n    globalMutate('appData');");
code = code.replace(/await supabase\.from\('users'\)\.update\(\{ avatar: avatarBase64 \}\)\.eq\('id', currentUser\.id\);/g, "$&\n    globalMutate('appData');");
code = code.replace(/await supabase\.from\('users'\)\.update\(\{ phone \}\)\.eq\('id', currentUser\.id\);/g, "$&\n    globalMutate('appData');");
code = code.replace(/await supabase\.from\('users'\)\.update\(\{ password, mustChangePassword: false \}\)\.eq\('id', currentUser\.id\);/g, "$&\n    globalMutate('appData');");
code = code.replace(/await supabase\.from\('users'\)\.update\(\{ balanceAlertThreshold: threshold \}\)\.eq\('id', currentUser\.id\);/g, "$&\n    globalMutate('appData');");
code = code.replace(/await supabase\.from\('users'\)\.update\(\{ password: passwordValue, mustChangePassword: !!passwordValue \}\)\.eq\('id', userId\);/g, "$&\n    globalMutate('appData');");
code = code.replace(/await supabase\.from\('users'\)\.update\(\{ vipLevelIndex: newVipLevel \}\)\.eq\('id', currentUser\.id\);/g, "$&\n    globalMutate('appData');");
code = code.replace(/await supabase\.from\('system_deposit_accounts'\)\.insert\(account\);/g, "$&\n    globalMutate('appData');");
code = code.replace(/await supabase\.from\('system_deposit_accounts'\)\.update\(account\)\.eq\('id', id\);/g, "$&\n    globalMutate('appData');");
code = code.replace(/await supabase\.from\('system_deposit_accounts'\)\.delete\(\)\.eq\('id', id\);/g, "$&\n    globalMutate('appData');");
code = code.replace(/await supabase\.from\('users'\)\.update\(\{ balance: u\.balance \+ amount \}\)\.eq\('id', currentUser\.id\);/g, "$&\n    globalMutate('appData');");

fs.writeFileSync('src/store.tsx', code);
console.log("Added globalMutate to all standard mutations.");
