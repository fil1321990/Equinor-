const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf-8');
code = code.replace(
  `    const interval = setInterval(checkExpiringInvestments, 60000);\n    return () =>   }, [users]);`,
  `    const interval = setInterval(checkExpiringInvestments, 60000);\n    return () => clearInterval(interval);\n  }, [users]);`
);
fs.writeFileSync('src/store.tsx', code);
