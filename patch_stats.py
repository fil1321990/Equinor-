import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = '''                    // Commissions
                    const commTotal = filteredComm.reduce((sum, c) => sum + c.amount, 0);
                    const invTotal = filteredInv.reduce((sum, i) => sum + i.amount, 0);'''

replacement1 = '''                    // Commissions
                    const commTotal = filteredComm.reduce((sum, c) => sum + c.amount, 0);
                    const invTotal = filteredInv.reduce((sum, i) => sum + i.amount, 0);

                    // Redemption Codes
                    const allRedemptionProducts = products.filter(p => p.type === 'redemption_code');
                    const allTimeRedemptionAmount = allRedemptionProducts.reduce((sum, p) => {
                        let claimedBy = [];
                        try { claimedBy = p.title ? JSON.parse(p.title) : []; } catch(e) {}
                        return sum + (claimedBy.length * p.min);
                    }, 0);
                    const todayRedemptionUsers = allRedemptionProducts.reduce((sum, p) => {
                        let claimedBy = [];
                        try { claimedBy = p.title ? JSON.parse(p.title) : []; } catch(e) {}
                        if (p.roi >= todayStart.getTime()) {
                            return sum + claimedBy.length;
                        }
                        return sum;
                    }, 0);'''

content = content.replace(target1, replacement1)

target2 = '''                        <StatCard title="Total Commission" value={typeof formatCurrency === 'function' ? formatCurrency(commTotal) : `₦${commTotal.toLocaleString()}`} />
                        <StatCard title="Approved Tx" value={approvedTx.length} />
                        
                        <StatCard title="Rejected Tx" value={rejectedTx.length} />
                      </div>'''

replacement2 = '''                        <StatCard title="Total Commission" value={typeof formatCurrency === 'function' ? formatCurrency(commTotal) : `₦${commTotal.toLocaleString()}`} />
                        <StatCard title="Approved Tx" value={approvedTx.length} />
                        
                        <StatCard title="Rejected Tx" value={rejectedTx.length} />

                        <StatCard title="Daily Code Claims" value={todayRedemptionUsers} subtitle="Today" />
                        <StatCard title="Total Code Value" value={typeof formatCurrency === 'function' ? formatCurrency(allTimeRedemptionAmount) : `₦${allTimeRedemptionAmount.toLocaleString()}`} subtitle="All Time" />
                      </div>'''

content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
