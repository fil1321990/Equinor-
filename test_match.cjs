const fs = require('fs');
let content = fs.readFileSync('/tmp/order.txt', 'utf-8');
const targetStr = content.substring(content.indexOf('                        const readingElapsedMs = Math.min(currentElapsedMs, maxElapsedCycleMs);'), content.indexOf('                        )') + 25);
console.log(targetStr.length);
