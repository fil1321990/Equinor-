const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const match = code.match(/I have paid/i);
if (match) {
    const lines = code.substring(0, match.index).split('\n');
    console.log("Found at line:", lines.length);
}
