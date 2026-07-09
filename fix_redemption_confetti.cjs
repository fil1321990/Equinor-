const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  /setShowCongratsEffect\(true\);\n                              setTimeout\(\(\) => setShowCongratsEffect\(false\), 2500\);/g,
  'setShowCongratsEffect(true);\n                              setTimeout(() => setShowCongratsEffect(false), 2500);\n                              setShowConfetti(true);\n                              setTimeout(() => setShowConfetti(false), 5000);'
);

code = code.replace(
  /setShowCongratsEffect\(true\);\n                        setTimeout\(\(\) => setShowCongratsEffect\(false\), 2500\);/g,
  'setShowCongratsEffect(true);\n                        setTimeout(() => setShowCongratsEffect(false), 2500);\n                        setShowConfetti(true);\n                        setTimeout(() => setShowConfetti(false), 5000);'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Confetti fixed.");
