const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  /const \[depositCheckoutTimer, setDepositCheckoutTimer\] = useState\(1800\);/g,
  `const [depositCheckoutTimer, setDepositCheckoutTimer] = useState(1800);
  useEffect(() => {
    if (depositCheckoutTimer > 0 && activeModal === "depositCheckout") {
      const timer = setTimeout(() => setDepositCheckoutTimer(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [depositCheckoutTimer, activeModal]);`
);
fs.writeFileSync('src/App.tsx', code);
