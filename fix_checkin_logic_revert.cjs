const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\/\/ Check if we hit a bonus streak[\s\S]*?await claimTask\(getBonusTaskId\(today\), extraEarn\);\n\s*\}/;

const replaceStr = `// Check if we hit a bonus streak
    if (BONUSES[newStreak as keyof typeof BONUSES] && !earnedBonuses.includes(newStreak)) {
      const bonus = BONUSES[newStreak as keyof typeof BONUSES];
      extraEarn += bonus;
      bonusMessage = \` Bonus claimed! +₦\${bonus}\`;
    }

    if (bonusMessage) {
      setToastMessage(\`Checked in!\${bonusMessage}\`);
    } else {
      setToastMessage(\`Checked in! Keep your streak going to earn bonuses.\`);
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 3000);

    // Call store to save the checkin and give the reward
    // Await checkin first so UI updates immediately for the checkmark
    await claimTask(getCheckinTaskId(today), 0);

    if (bonusMessage) {
      await claimTask(getBonusTaskId(newStreak), extraEarn);
    }`;

code = code.replace(regex, replaceStr);

const oldCheckUI = `{checked && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none flex items-center justify-center">
                            <Check className="text-white w-7 h-7 stroke-[3]" />
                          </div>
                        )}`;

const newCheckUI = `{checked && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#ffd24d] rounded-full pointer-events-none flex items-center justify-center shadow-sm">
                            <Check className="text-[#0a0a1a] w-3.5 h-3.5 stroke-[4]" />
                          </div>
                        )}`;

code = code.replace(oldCheckUI, newCheckUI);

fs.writeFileSync('src/App.tsx', code);
