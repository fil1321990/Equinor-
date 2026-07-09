const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const matches = [...code.matchAll(/I have paid/ig)];
matches.forEach(match => {
    const lines = code.substring(0, match.index).split('\n');
    console.log("Found at line:", lines.length);
});
