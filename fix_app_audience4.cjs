const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\nexport const getAudienceType = \(p: any\) => \{\n  if \(p\.audienceType\) return p\.audienceType;\n  if \(p\.type === 'redemption_code'\) return 'all';\n  try \{\n    const parsed = JSON\.parse\(p\.title \|\| "\{\}"\);\n    return parsed\.audienceType \|\| "all";\n  \} catch\(e\) \{\n    return "all";\n  \}\n\};\n\n/g;

code = code.replace(regex, '');

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

code = code.replace(/import React, \{ useState, useEffect, useRef, useMemo, useCallback \} from 'react';/, `import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';` + helper);

fs.writeFileSync('src/App.tsx', code);
