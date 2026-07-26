const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = 'setSuccessAnimMessage("Deposit request submitted! Awaiting Bank confirmation.");';
const replacement = 'setSuccessAnimMessage("Deposit request submitted! Please send your payment proof to the manager via CS chat or Telegram for approval.");';

content = content.replaceAll(target, replacement);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched success message');
