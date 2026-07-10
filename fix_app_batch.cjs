const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/collectEarnings,/g, 'collectEarnings, batchCollectEarnings,');

const regex = /const handleGetAll = async \(\) => \{[\s\S]*?if \(selectedCount > 0\) \{/m;

const newCode = `const handleGetAll = async () => {
              let selectedCount = 0;
              let totalAmountCollected = 0;
              
              const idsToCollect: string[] = [];
              for (const inv of activeInvestments) {
                if (!stagedCollections.includes(inv.id)) continue;
                
                const invNow = new Date();
                const invStart = new Date(inv.startDate);
                const invEnd = new Date(inv.endDate);
                const invLastCollected = inv.lastCollectedDate ? new Date(inv.lastCollectedDate) : invStart;
                
                const invMsInADay = 1000 * 3600 * 24;
                const tPlusDays = inv.payout_cycle_days || inv.tPlusDays || 1;
                const msInCycle = invMsInADay * tPlusDays;
                
                const currentElapsed = Math.max(0, invNow.getTime() - invLastCollected.getTime());
                
                const isCycleComplete = currentElapsed >= msInCycle || invNow >= invEnd;
                if (inv.status === "active" && isCycleComplete) {
                  idsToCollect.push(inv.id);
                  selectedCount++;
                }
              }
              
              if (idsToCollect.length > 0) {
                 const res = await batchCollectEarnings(idsToCollect);
                 if (res && res.success && res.amount) {
                   totalAmountCollected = res.amount;
                 }
              }

              if (selectedCount > 0) {`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/App.tsx', code);
