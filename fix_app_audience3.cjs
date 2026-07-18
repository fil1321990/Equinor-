const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const helper = `\nexport const getAudienceType = (p: any) => {
  if (p.audienceType) return p.audienceType;
  if (p.type === 'redemption_code') return 'all';
  try {
    const parsed = JSON.parse(p.title || "{}");
    return parsed.audienceType || "all";
  } catch(e) {
    return "all";
  }
};\n\n`;

code = code.replace(/export default function App\(\) \{/, helper + 'export default function App() {');
fs.writeFileSync('src/App.tsx', code);
