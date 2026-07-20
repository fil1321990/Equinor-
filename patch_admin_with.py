import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                    const todayStart = new Date();
                    todayStart.setHours(0,0,0,0);
                    const todayDepApproved = transactions.filter(t => t.type === "deposit" && t.status === "approved" && new Date(t.date).getTime() >= todayStart.getTime());
                    const todayDepTotal = todayDepApproved.reduce((sum, t) => sum + t.amount, 0);
                    const todayDepCount = todayDepApproved.length;"""

replacement = """                    const todayStart = new Date();
                    todayStart.setHours(0,0,0,0);
                    const todayDepApproved = transactions.filter(t => t.type === "deposit" && t.status === "approved" && new Date(t.date).getTime() >= todayStart.getTime());
                    const todayDepTotal = todayDepApproved.reduce((sum, t) => sum + t.amount, 0);
                    const todayDepCount = todayDepApproved.length;
                    
                    const todayWithApproved = transactions.filter(t => t.type === "withdrawal" && t.status === "approved" && new Date(t.date).getTime() >= todayStart.getTime());
                    const todayWithTotal = todayWithApproved.reduce((sum, t) => sum + t.amount, 0);
                    const todayWithCount = todayWithApproved.length;"""

content = content.replace(target, replacement)

target2 = """                        <StatCard title="Deposits Total" value={typeof formatCurrency === 'function' ? formatCurrency(depTotal) : `₦${depTotal.toLocaleString()}`} subtitle="Approved Only" />
                        
                        <StatCard title="Withdrawals Count" value={withTx.length} />"""

replacement2 = """                        <StatCard title="Deposits Total" value={typeof formatCurrency === 'function' ? formatCurrency(depTotal) : `₦${depTotal.toLocaleString()}`} subtitle="Approved Only" />
                        
                        <StatCard title="Today's Withdrawals" value={todayWithCount} subtitle="Approved Today" />
                        <StatCard title="Today's With Total" value={typeof formatCurrency === 'function' ? formatCurrency(todayWithTotal) : `₦${todayWithTotal.toLocaleString()}`} subtitle="Approved Today" />

                        <StatCard title="Withdrawals Count" value={withTx.length} />"""

content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)

