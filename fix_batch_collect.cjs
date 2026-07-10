const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const targetMethod = `  const collectEarnings = async (investmentId: string, suppressAlert: boolean = false): Promise<{ success: boolean; amount?: number; message?: string }> => {`;

const newMethod = `  const batchCollectEarnings = async (investmentIds: string[]): Promise<{ success: boolean; amount?: number }> => {
    if (!currentUser) return { success: false };
    
    let totalToAdd = 0;
    const invUpdates: any[] = [];
    const incRecords: any[] = [];
    
    for (const investmentId of investmentIds) {
      const investment = investments.find((inv) => inv.id === investmentId);
      if (!investment || investment.userId !== currentUser.id || investment.status !== "active") continue;
      
      const now = new Date();
      const startDate = new Date(investment.startDate);
      const endDate = new Date(investment.endDate);
      const lastCollected = investment.lastCollectedDate ? new Date(investment.lastCollectedDate) : startDate;
      
      const msInADay = 1000 * 3600 * 24;
      const tPlusDays = investment.payout_cycle_days || investment.tPlusDays || 1;
      const msInCycle = msInADay * tPlusDays;
      
      const currentElapsedMs = Math.max(0, now.getTime() - lastCollected.getTime());
      const maxAllowedElapsed = Math.min(msInCycle, currentElapsedMs);
      const timeToCollectMs = Math.min(maxAllowedElapsed, endDate.getTime() - lastCollected.getTime());
      
      const isCycleComplete = currentElapsedMs >= msInCycle || now.getTime() >= endDate.getTime();
      if (!isCycleComplete) continue;
      
      const dailyIncome = getDailyIncome(investment, currentUser, users, investments);
      const profitToCollect = (timeToCollectMs / msInADay) * dailyIncome;
      
      const newLastCollected = new Date(lastCollected.getTime() + timeToCollectMs);
      const isFinished = newLastCollected.getTime() >= endDate.getTime();
      
      const newStatus = isFinished ? "completed" : "active";
      const newDateStr = newLastCollected.toISOString();
      const thisTotal = profitToCollect + (isFinished ? investment.amount : 0);
      
      if (thisTotal > 0) {
        totalToAdd += thisTotal;
        invUpdates.push({ id: investment.id, status: newStatus, lastCollectedDate: newDateStr });
        incRecords.push({
          userId: currentUser.id,
          investmentId: investment.id,
          planName: investment.planName,
          amount: thisTotal,
          date: now.toISOString()
        });
      }
    }
    
    if (totalToAdd === 0) return { success: false };

    // DB updates
    try {
      const { data: userData } = await supabase.from('users').select('balance').eq('id', currentUser.id).single();
      const newBalance = Number(userData?.balance || 0) + totalToAdd;
      const { error: err1 } = await supabase.from('users').update({ balance: newBalance }).eq('id', currentUser.id);
      if (err1) console.error("Update users error:", err1);
      
      for (const update of invUpdates) {
        const { error: err2 } = await supabase.from('investments').update({
           status: update.status,
           lastCollectedDate: update.lastCollectedDate
        }).eq('id', update.id);
        if (err2) console.error("Update inv error:", err2);
      }
      
      if (incRecords.length > 0) {
         const { error: err3 } = await supabase.from('incomeRecords').insert(incRecords);
         if (err3) console.error("Insert inc error:", err3);
      }
    } catch (err) {
      console.error(err);
    }

    // Optimistic state updates
    setInvestments((prev) => 
       prev.map((inv) => {
         const update = invUpdates.find(u => u.id === inv.id);
         if (update) {
           return { ...inv, status: update.status, lastCollectedDate: update.lastCollectedDate };
         }
         return inv;
       })
    );

    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, balance: u.balance + totalToAdd } : u));
    setCurrentUser(prev => prev ? { ...prev, balance: prev.balance + totalToAdd } : prev);
    
    if (incRecords.length > 0) {
      setIncomeRecords(prev => [...incRecords.map(r => ({...r, id: Math.random().toString(36).substring(2, 9)})), ...prev]);
    }
    
    globalMutate('appData');
    return { success: true, amount: totalToAdd };
  };

  const collectEarnings = async (investmentId: string, suppressAlert: boolean = false): Promise<{ success: boolean; amount?: number; message?: string }> => {`;

code = code.replace(targetMethod, newMethod);
fs.writeFileSync('src/store.tsx', code);
