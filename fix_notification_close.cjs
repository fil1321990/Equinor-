const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(\) => \{\n\s*setActiveModal\(null\);\n\s*\}\}/g,
  `onClick={() => setShowVisualNotification(false)}`
);

fs.writeFileSync('src/App.tsx', code);
