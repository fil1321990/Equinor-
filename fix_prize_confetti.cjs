const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(
  'claimTask(`prize_draw_${opp.id}`, reward);\n                       triggerVisualNotification("you_won", "CONGRATULATIONS", `You won ₦${reward}`);',
  'claimTask(`prize_draw_${opp.id}`, reward);\n                       triggerVisualNotification("you_won", "CONGRATULATIONS", `You won ₦${reward}`);\n                       setShowConfetti(true);\n                       setTimeout(() => setShowConfetti(false), 5000);'
);
fs.writeFileSync('src/App.tsx', code);
console.log("Prize confetti fixed.");
