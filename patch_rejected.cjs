const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                        {t.type === 'withdrawal' && t.status === 'pending' && (
                          <div className="pt-2 border-t border-white/5">`;

const replacement = `                        {t.type === 'deposit' && t.status === 'rejected' && (
                          <div className="pt-3 mt-1 border-t border-white/10">
                            <p className="text-[12px] text-red-400 font-medium leading-snug">
                              Deposit rejected. Please submit your payment proof to the manager via CS chat or Telegram for approval, then request a new deposit.
                            </p>
                          </div>
                        )}
                        {t.type === 'withdrawal' && t.status === 'pending' && (
                          <div className="pt-2 border-t border-white/5">`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched rejected deposit message');
