const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(
  'setSuccessAnimAmount(totalAmountCollected);\n                setActiveModal("successAnimated");',
  'setSuccessAnimAmount(totalAmountCollected);\n                setActiveModal("successAnimated");\n                setShowConfetti(true);\n                setTimeout(() => setShowConfetti(false), 5000);'
);
fs.writeFileSync('src/App.tsx', code);
console.log("Confetti fixed.");
