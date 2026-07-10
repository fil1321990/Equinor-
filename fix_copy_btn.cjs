const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<button\\s+onClick=\\{[\\s\\S]*?navigator\\.clipboard\\.writeText[\\s\\S]*?triggerVisualNotification\\("alert", "Notice", "Account number copied! Please proceed to your banking app to complete the transfer\\."\\);[\\s\\S]*?\\}[\\s\\S]*?className="px-6 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold active:scale-95 transition-transform shadow-md"[\\s\\S]*?>[\\s\\S]*?Copy[\\s\\S]*?<\\/button>/;

const replacement = `<button
                          onClick={(e) => {
                            const btn = e.currentTarget;
                            navigator.clipboard.writeText(systemDepositAccounts[depositCheckoutAccountIndex % systemDepositAccounts.length]?.accountNumber).catch(() => {});
                            setDepositCheckoutStep(2);
                            btn.innerText = "Copied!";
                            btn.classList.add("bg-green-600");
                            btn.classList.remove("bg-blue-600");
                            setTimeout(() => {
                              btn.innerText = "Copy";
                              btn.classList.remove("bg-green-600");
                              btn.classList.add("bg-blue-600");
                            }, 2000);
                          }}
                          className="px-6 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold active:scale-95 transition-transform shadow-md"
                        >
                          Copy
                        </button>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
