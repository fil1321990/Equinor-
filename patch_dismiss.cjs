const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const hookTarget = `  const [showRejectedBanner, setShowRejectedBanner] = useState(false);

  useEffect(() => {
    if (activeTab === "mine" && currentUser) {
      const userDeposits = transactions.filter(t => t.userId === currentUser.id && t.type === 'deposit');
      if (userDeposits.length > 0) {
        userDeposits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const latestDeposit = userDeposits[0];
        if (latestDeposit.status === 'rejected') {
          setShowRejectedBanner(true);
          const timer = setTimeout(() => setShowRejectedBanner(false), 8000);
          return () => clearTimeout(timer);
        }
      }
    } else {
      setShowRejectedBanner(false);
    }
  }, [activeTab, currentUser, transactions]);`;

const hookReplacement = `  const [showRejectedBanner, setShowRejectedBanner] = useState(false);
  const [dismissedRejectedTxId, setDismissedRejectedTxId] = useState<string | null>(() => localStorage.getItem('dismissedRejectedTxId'));
  const [currentRejectedTxId, setCurrentRejectedTxId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "mine" && currentUser) {
      const userDeposits = transactions.filter(t => t.userId === currentUser.id && t.type === 'deposit');
      if (userDeposits.length > 0) {
        userDeposits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const latestDeposit = userDeposits[0];
        if (latestDeposit.status === 'rejected' && latestDeposit.id !== dismissedRejectedTxId) {
          setShowRejectedBanner(true);
          setCurrentRejectedTxId(latestDeposit.id);
          const timer = setTimeout(() => {
            setShowRejectedBanner(false);
            setDismissedRejectedTxId(latestDeposit.id);
            localStorage.setItem('dismissedRejectedTxId', latestDeposit.id);
          }, 8000);
          return () => clearTimeout(timer);
        }
      }
    } else {
      setShowRejectedBanner(false);
    }
  }, [activeTab, currentUser, transactions, dismissedRejectedTxId]);`;

content = content.replace(hookTarget, hookReplacement);

const uiTarget = `                  <button onClick={() => setShowRejectedBanner(false)} className="shrink-0 p-1 bg-white/10 rounded-full active:bg-white/20 ml-auto">
                    <X className="w-4 h-4" />
                  </button>`;

const uiReplacement = `                  <button onClick={() => {
                    setShowRejectedBanner(false);
                    if (currentRejectedTxId) {
                      setDismissedRejectedTxId(currentRejectedTxId);
                      localStorage.setItem('dismissedRejectedTxId', currentRejectedTxId);
                    }
                  }} className="shrink-0 p-1 bg-white/10 rounded-full active:bg-white/20 ml-auto">
                    <X className="w-4 h-4" />
                  </button>`;

content = content.replace(uiTarget, uiReplacement);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched dismissed logic');
