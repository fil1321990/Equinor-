const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const helper = `\n  const getAudienceType = (p: any) => {
    if (p.audienceType) return p.audienceType;
    if (p.type === 'redemption_code') return 'all';
    try {
      const parsed = JSON.parse(p.title || "{}");
      return parsed.audienceType || "all";
    } catch(e) {
      return "all";
    }
  };\n\n`;

code = code.replace(/const getOffsetMs =/g, helper + 'const getOffsetMs =');
fs.writeFileSync('src/App.tsx', code);
