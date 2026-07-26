const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const hookTarget = `  const [statsPeriod, setStatsPeriod] = useState<"all" | "this_week" | "last_week" | "last_month">("all");
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [editingTxNotes, setEditingTxNotes] = useState("");
  const [editingTxTags, setEditingTxTags] = useState("");`;

const hookReplacement = `  const [statsPeriod, setStatsPeriod] = useState<"all" | "this_week" | "last_week" | "last_month">("all");
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [editingTxNotes, setEditingTxNotes] = useState("");
  const [editingTxTags, setEditingTxTags] = useState("");
  const [showRejectedBanner, setShowRejectedBanner] = useState(false);

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

content = content.replace(hookTarget, hookReplacement);

const uiTarget = `          {activeTab === "mine" && (
            <div className="pb-0 relative z-10 w-full">`;

const uiReplacement = `          {activeTab === "mine" && (
            <div className="pb-0 relative z-10 w-full">
              {showRejectedBanner && (
                <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-3 rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-top-5 duration-500 flex items-start gap-3">
                  <div className="bg-white/20 p-1.5 rounded-full mt-0.5 shrink-0">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-sm">Deposit Rejected</span>
                    <span className="text-xs leading-snug">
                      Your recent deposit was rejected. Please submit your payment proof to the manager via CS chat or Telegram for approval, then request a new deposit.
                    </span>
                  </div>
                  <button onClick={() => setShowRejectedBanner(false)} className="shrink-0 p-1 bg-white/10 rounded-full active:bg-white/20 ml-auto">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}`;

content = content.replace(uiTarget, uiReplacement);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched rejected banner');
