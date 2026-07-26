const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('AlertCircle,')) {
  content = content.replace('AlertTriangle,', 'AlertTriangle, AlertCircle,');
  fs.writeFileSync('src/App.tsx', content);
  console.log('Added AlertCircle import');
}
