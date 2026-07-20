import sys
import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                    // Referrals: Users referred by someone
                    const referralCount = users.filter(u => u.referredBy).length; // Total referrals
                    
                    // Commissions
                    const commTotal = filteredComm.reduce((sum, c) => sum + c.amount, 0);"""

replacement = """                    // Referrals: Users referred by someone
                    const referralCount = users.filter(u => u.referredBy).length; // Total referrals
                    
                    const todayStart = new Date();
                    todayStart.setHours(0,0,0,0);
                    const todayDepApproved = transactions.filter(t => t.type === "deposit" && t.status === "approved" && new Date(t.date).getTime() >= todayStart.getTime());
                    const todayDepTotal = todayDepApproved.reduce((sum, t) => sum + t.amount, 0);
                    const todayDepCount = todayDepApproved.length;

                    // Commissions
                    const commTotal = filteredComm.reduce((sum, c) => sum + c.amount, 0);"""

content = content.replace(target, replacement)


target2 = """                        <StatCard title="Active Users" value={activeUsersCount} subtitle={statsPeriod === "all" ? "Currently Active" : "Active in Period"} />
                        
                        <StatCard title="Deposits Count" value={depTx.length} />"""

replacement2 = """                        <StatCard title="Active Users" value={activeUsersCount} subtitle={statsPeriod === "all" ? "Currently Active" : "Active in Period"} />
                        
                        <StatCard title="Today's Deposits" value={todayDepCount} subtitle="Approved Today" />
                        <StatCard title="Today's Dep Total" value={typeof formatCurrency === 'function' ? formatCurrency(todayDepTotal) : `₦${todayDepTotal.toLocaleString()}`} subtitle="Approved Today" />

                        <StatCard title="Deposits Count" value={depTx.length} />"""

content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)

