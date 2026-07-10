const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The "I Have Paid" button in deposit checkout
code = code.replace(
  />\s*I Have Paid\s*<\/button>/,
  '>{isProcessing ? "Processing..." : "Confirm Payment"}</button>'
);

fs.writeFileSync('src/App.tsx', code);
