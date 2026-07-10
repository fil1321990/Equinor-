const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const handleCheckIn = async \(\) => \{[\s\S]*?setTimeout\(\(\) => \{\n      setToastMessage\(null\);\n    \}, 3000\);\n  \};/m;

const replacement = `const handleCheckIn = async () => {
    if (isCheckedInToday) return;

    let newStreak = continuousStreak + 1;
    let extraEarn = 0;
    let bonusMessage = "";

    // Check if we hit a bonus streak
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
    }
  };`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
