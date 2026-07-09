const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  /if \(depositCheckoutTimer > 0 && activeModal === "depositCheckout"\) \{/g,
  `if (depositCheckoutTimer > 0 && activeModal === "depositCheckout") {`
);
fs.writeFileSync('src/App.tsx', code);
