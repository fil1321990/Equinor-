const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'signup(registerForm.phone, registerForm.password, registerForm.invitationCode);',
  'setIsLoggingIn(true);\n                  try {\n                    await new Promise(r => setTimeout(r, 1500));\n                    await signup(registerForm.phone, registerForm.password, registerForm.invitationCode);\n                  } finally {\n                    setIsLoggingIn(false);\n                  }'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Signup loading fixed.");
