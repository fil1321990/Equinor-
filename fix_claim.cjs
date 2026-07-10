const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const regex = /const claimTask = async \(taskId: string, reward: number\) => \{[\s\S]*?const newBalance = currentUser\.balance \+ reward;/;

const replacement = `const claimTask = async (taskId: string, reward: number) => {
    if (!currentUser) return;
    
    // Check locally first to fail fast
    if (currentUser.claimedTasks?.includes(taskId)) return;
    
    // Fetch latest to avoid race conditions
    const { data: latestUser } = await supabase.from('users').select('balance, claimedTasks').eq('id', currentUser.id).single();
    if (!latestUser) return;
    if (latestUser.claimedTasks?.includes(taskId)) return;
    
    const newTasks = [...(latestUser.claimedTasks || []), taskId];
    const newBalance = Number(latestUser.balance || 0) + Number(reward || 0);`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/store.tsx', code);
