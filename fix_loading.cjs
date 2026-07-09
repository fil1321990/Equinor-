const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'const res = await login(loginIdentifier, loginPassword);',
  'await new Promise(r => setTimeout(r, 1500));\n      const res = await login(loginIdentifier, loginPassword);'
);

code = code.replace(
  'const success = await signup(signupName, signupPhone, signupPassword, signupReferral);',
  'await new Promise(r => setTimeout(r, 1500));\n      const success = await signup(signupName, signupPhone, signupPassword, signupReferral);'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Loading fixed.");
