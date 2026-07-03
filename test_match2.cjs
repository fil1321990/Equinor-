const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');
const startIdx = content.indexOf('                        const readingElapsedMs = Math.min(currentElapsedMs, maxElapsedCycleMs);');
const endIdx = content.indexOf('                        )') + 25;
console.log({ startIdx, endIdx });
