const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/{p\.maxQuota \? <span className="text-\[10px\] bg-blue-500\/20 text-blue-300 px-2 py-0\.5 rounded font-black">Quota: {p\.maxQuota}<\/span> : null}/,
`{p.maxQuota ? <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-black">Quota: {p.maxQuota}</span> : null}
                              {p.audienceType && p.audienceType !== 'all' ? <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-black uppercase">{p.audienceType} Only</span> : null}`);

fs.writeFileSync('src/App.tsx', code);
