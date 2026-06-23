import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

console.log("App.tsx is loading...");

import {
  Crown,
  CheckSquare,
  CalendarCheck,
  CreditCard,
  Wallet,
  MoreHorizontal,
  Home,
  LayoutGrid,
  MessageSquare,
  User,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Landmark,
  Settings,
  Info,
  Download,
  ChevronRight,
  ListOrdered,
  Users,
  Copy,
  CheckCheck,
  FileText,
  ClipboardList,
  BarChart2,
  Gift,
  LogOut,
  Loader2,
  ShieldCheck,
  Check,
  X,
  Barcode,
  Clock,
  ChevronLeft,
  PartyPopper,
  Zap,
  Headphones,
  Bell,
  ArrowDownCircle,
  Star,
  Bookmark,
  ChevronDown,
  ArrowUpCircle,
  Gem,
  ArrowDownToLine,
  Lock,
  ArrowRightCircle,
  Layers,
  UserCheck,
  Triangle,
  Send,
  CheckCircle2,
  Banknote,
  ImagePlus
} from "lucide-react";
import { AppProvider, useAppStore } from "./store";
import { getDailyIncome } from "./lib/earnings";
import { EquinorStar } from "./components/EquinorStar";
import { RankBadge } from "./components/RankBadge";
import { VIP_LEVELS, EQUITY_EXCHANGE_TIERS, VIP_MEMBER_EXCLUSIVE_TIERS } from "./services/vip";
import Confetti from "react-confetti";

import { playNotificationSound } from "./utils/audio";
import imgPurchaseSuccess from './assets/images/equinor_purchase_success_1782199177262.jpg';
import imgRewardUnlocked from './assets/images/equinor_reward_unlocked_1782199192098.jpg';
import imgYouWon from './assets/images/equinor_you_won_1782199202549.jpg';
import imgTryAgain from './assets/images/equinor_try_again_1782199215072.jpg';
import imgInsufficientBalance from './assets/images/equinor_insufficient_balance_1782199228967.jpg';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

const triggerHaptic = () => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(50);
  }
};

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    
    const updateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <span className="font-mono">{timeLeft.days} Day {timeLeft.hours.toString().padStart(2, '0')} : {timeLeft.minutes.toString().padStart(2, '0')} : {timeLeft.seconds.toString().padStart(2, '0')}</span>
  );
};

const OrderCountdown = ({ endTime }: { endTime: string }) => {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, new Date(endTime).getTime() - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, new Date(endTime).getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span className="font-mono text-white/90 text-sm font-semibold">
      {days} Day {hours.toString().padStart(2, "0")} : {minutes.toString().padStart(2, "0")} : {seconds.toString().padStart(2, "0")}
    </span>
  );
};

const processImageUpload = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max = 1200; // Cloudinary will handle it, but resize locally to save bandwidth

        if (width > height && width > max) {
          height = Math.round((height *= max / width));
          width = max;
        } else if (height > max) {
          width = Math.round((width *= max / height));
          height = max;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        let base64ImageString = event.target?.result as string;
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          base64ImageString = canvas.toDataURL('image/jpeg', 0.8);
        }

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64ImageString }),
          });
          const data = await response.json();
          if (data.status === 'success' && data.url) {
            resolve(data.url);
          } else {
            reject(new Error(data.message || 'Upload failed'));
          }
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

function MainApp() {
  const {
    currentUser,
    login,
    logout,
    signup,
    users,
    investments,
    products,
    requestDeposit,
    requestWithdrawal,
    createInvestment,
    collectEarnings,
    updateBankDetails,
    updateAvatar,
    updatePhone,
    updatePassword,
    addProduct,
    refreshProducts,
    editProduct,
    deleteProduct,
    upgradeVip,
    transactions,
    commissions,
    incomeRecords,
    approveTransaction,
    rejectTransaction,
    updateTransactionAdminInfo,
    disableUser,
    enableUser,
    adminUsdtAddress,
    setAdminUsdtAddress,
    announcement,
    setAnnouncement,
    promoImage,
    setPromoImage,
    aboutUsImage,
    setAboutUsImage,
    carouselImages,
    addCarouselImage,
    removeCarouselImage,
    addBalance,
    claimTask,
    adminResetUserPassword,
    managerLink,
    groupLink,
    updateContactLinks,
    restrictUserWithdrawals,
    systemDepositAccounts,
    addSystemDepositAccount,
    deleteSystemDepositAccount,
    chatMessages,
    sendChatMessage,
    updateBalanceAlertThreshold,
  } = useAppStore();

  useEffect(() => {
    if (currentUser?.disabled || currentUser?.role === 'disabled') {
      alert("Your account has been disabled. Please contact support.");
      logout();
    }
  }, [currentUser?.disabled, currentUser?.role, logout]);

  const [activeTab, setActiveTab] = useState<
    "home" | "product" | "order" | "mine" | "admin" | "checkin" | "task" | "vip" | "myteam"
  >(() => {
    try {
      const stored = localStorage.getItem("app_activeTab");
      return (stored as any) || "home";
    } catch {
      return "home";
    }
  });

  useEffect(() => {
    localStorage.setItem("app_activeTab", activeTab);
  }, [activeTab]);
  const [orderTab, setOrderTab] = useState<"general" | "vip" | "special" | "expired">("general");
  const [productTab, setProductTab] = useState<"general" | "vip" | "special">("general");
  const [activeTeamTab, setActiveTeamTab] = useState<"A" | "B" | "C">("A");

  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    if (activeTab === "product") {
      setIsLoadingProducts(true);
      const timer = setTimeout(() => setIsLoadingProducts(false), 800);
      return () => clearTimeout(timer);
    }
  }, [activeTab, productTab]);

  useEffect(() => {
    if (activeTab === "order") {
      setIsLoadingOrders(true);
      const timer = setTimeout(() => setIsLoadingOrders(false), 800);
      return () => clearTimeout(timer);
    }
  }, [activeTab, orderTab]);

  const [tick, setTick] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isUploadingChatImg, setIsUploadingChatImg] = useState(false);
  const [adminChatUserContext, setAdminChatUserContext] = useState<string | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [adminSubTab, setAdminSubTab] = useState<"general" | "top" | "transactions">("general");
  const [txPeriod, setTxPeriod] = useState<"all" | "weekly" | "monthly">("all");
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [editingTxNotes, setEditingTxNotes] = useState("");
  const [editingTxTags, setEditingTxTags] = useState("");
  
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  const [activeModal, setActiveModal] = useState<null | "deposit" | "withdraw" | "bankDetails" | "about" | "convidar" | "levelUp" | "setup" | "setupPhone" | "setupPassword" | "setupAlertThreshold" | "addProduct" | "editProduct" | "fundingDetails" | "commissionRecord" | "incomeRecord" | "redemptionCode" | "redemptionReward" | "purchaseSuccess" | "contact" | "equinorConfirm" | "buyProduct" | "sysAnnouncement" | "download" | "addDepositAccount" | "depositCheckout" | "successAnimated" | "visualNotification">(
    null,
  );
  
  type VisualNotificationType = 'purchase_success' | 'reward_unlocked' | 'you_won' | 'try_again' | 'insufficient_balance';
  const [notificationData, setNotificationData] = useState<{type: VisualNotificationType, title: string, subtitle: string}>({ type: 'purchase_success', title: '', subtitle: '' });

  const triggerVisualNotification = (type: VisualNotificationType, title: string, subtitle: string) => {
    setNotificationData({ type, title, subtitle });
    setActiveModal("visualNotification");
    if (type === 'purchase_success' || type === 'reward_unlocked' || type === 'you_won') {
       playNotificationSound('success');
    } else {
       playNotificationSound('error');
    }
  };

  const [successAnimMessage, setSuccessAnimMessage] = useState("");
  const [successAnimTitle, setSuccessAnimTitle] = useState("Success!");
  const [successAnimAmount, setSuccessAnimAmount] = useState<number | null>(null);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeModal === "depositCheckout") {
      interval = setInterval(() => {
        setDepositCheckoutTimer(prev => {
          if (prev <= 1) {
             setDepositCheckoutAccountIndex(idx => {
                const accountsCount = systemDepositAccounts.length || 1;
                return (idx + 1) % accountsCount;
             });
             return 1800; // Reset to 30 mins
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeModal, systemDepositAccounts.length]);

  const [notifications, setNotifications] = useState<{id: string, title: string, message: string, type: 'success' | 'error' | 'info'}[]>([]);

  const addNotification = (title: string, message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const prevTransactions = React.useRef(transactions);
  const prevBalanceRef = React.useRef<number>();

  useEffect(() => {
    if (!currentUser) return;
    
    // Balance Drop Alert Logic
    if (prevBalanceRef.current !== undefined && currentUser.balanceAlertThreshold !== undefined) {
      if (prevBalanceRef.current >= currentUser.balanceAlertThreshold && currentUser.balance < currentUser.balanceAlertThreshold) {
        // Balance dropped below threshold!
        setToastMessage(`Alert: Your balance has dropped below ₦${currentUser.balanceAlertThreshold.toLocaleString()}!`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    }
    prevBalanceRef.current = currentUser.balance;

    // Compare prevTransactions and current transactions
    const prev = prevTransactions.current;
    
    transactions.forEach(newTx => {
      if (newTx.userId !== currentUser.id) return;
      
      const oldTx = prev.find(t => t.id === newTx.id);
      if (oldTx && oldTx.status === 'pending' && newTx.status !== 'pending') {
        const typeText = newTx.type === 'deposit' ? 'Deposit' : 'Withdrawal';
        const statusText = newTx.status === 'approved' ? 'Approved' : 'Rejected';
        const type = newTx.status === 'approved' ? 'success' : 'error';
        addNotification(
          `${typeText} ${statusText}`,
          `Your ${newTx.type} of ₦${Number(newTx.amount).toLocaleString()} has been ${newTx.status}.`,
          type
        );
      }
    });

    prevTransactions.current = transactions;
  }, [transactions, currentUser?.id]);

  const [announcementSeen, setAnnouncementSeen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleDownloadApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setActiveModal("download");
    }
  };

  useEffect(() => {
    if (currentUser && announcement && !announcementSeen && activeModal === null) {
      setActiveModal("sysAnnouncement");
      setAnnouncementSeen(true);
    }
  }, [currentUser, announcement, announcementSeen, activeModal]);
  const [selectedProductToBuy, setSelectedProductToBuy] = useState<any | null>(null);
  const [buyingQuantity, setBuyingQuantity] = useState("1");
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [fundingTab, setFundingTab] = useState<"all" | "deposit" | "withdrawal">("all");
  const [txSearch, setTxSearch] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [txFilterStatus, setTxFilterStatus] = useState<"all" | "pending" | "completed" | "failed">("all");
  const [txFilterDate, setTxFilterDate] = useState<"all" | "today" | "week" | "month">("all");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositMethod, setDepositMethod] = useState<"ngn" | "usdt">("ngn");
  const [depositReference, setDepositReference] = useState("");
  const [equinorInputAmount, setEquinorInputAmount] = useState("");
  const [equinorSelectedPlan, setEquinorSelectedPlan] = useState<any>(null);
  const [setupPhoneValue, setSetupPhoneValue] = useState("");
  const [setupOldPasswordValue, setSetupOldPasswordValue] = useState("");
  const [setupPasswordValue, setSetupPasswordValue] = useState("");
  const [language, setLanguage] = useState("English");
  const [setupAlertThresholdValue, setSetupAlertThresholdValue] = useState("");
  const [redemptionCode, setRedemptionCode] = useState("");
  const [rewardAmount, setRewardAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const validRedemptionCodes = useMemo(() => {
    return products
      .filter(p => p.type === 'redemption_code')
      .map(p => {
        let claimedBy = [];
        try { claimedBy = p.title ? JSON.parse(p.title) : []; } catch (e) { }
        return {
          code: p.name,
          amount: p.min,
          minClaims: p.days,
          maxClaims: p.maxQuota || 1,
          validityMinutes: p.tPlusDays || 60,
          claimedBy,
          createdAt: p.roi
        };
      });
  }, [products]);
  const [newRedemptionAmount, setNewRedemptionAmount] = useState("");
  const [newRedemptionMin, setNewRedemptionMin] = useState("1");
  const [newRedemptionMax, setNewRedemptionMax] = useState("1");
  const [newRedemptionValidity, setNewRedemptionValidity] = useState("60");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentProcessingState, setPaymentProcessingState] = useState<{ step: number, message: string } | null>(null);
  const [collectingIds, setCollectingIds] = useState<Record<string, boolean>>({});
  const [showCongratsEffect, setShowCongratsEffect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [banksList, setBanksList] = useState<{code: string, name: string}[]>([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductTitle, setNewProductTitle] = useState("EQUINOR");
  const [newProductRoi, setNewProductRoi] = useState("");
  const [newProductMin, setNewProductMin] = useState("");
  const [newProductDays, setNewProductDays] = useState("30");
  const [newProductTPlusDays, setNewProductTPlusDays] = useState("1");
  const [newProductQuota, setNewProductQuota] = useState("0");
  const [newProductType, setNewProductType] = useState<"general"|"vip"|"special">("general");
  const [newProductImageUrl, setNewProductImageUrl] = useState("");
  const [newProductPromoUnlock, setNewProductPromoUnlock] = useState("");
  const [newDepositAccountBank, setNewDepositAccountBank] = useState("Opay");
  const [newDepositAccountName, setNewDepositAccountName] = useState("");
  const [newDepositAccountNumber, setNewDepositAccountNumber] = useState("");
  const [depositCheckoutTimer, setDepositCheckoutTimer] = useState(1800);
  const [depositCheckoutAccountIndex, setDepositCheckoutAccountIndex] = useState(0);
  const [isLoadingProductTypes, setIsLoadingProductTypes] = useState(false);
  const [isProcessingProduct, setIsProcessingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productTypesList, setProductTypesList] = useState<{value: string, label: string}[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === '/register') return true;
    if (path === '/login' || hash === '#/login') return false;
    return true; // Default to registration
  });
  const [authRoute, setAuthRoute] = useState(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (hash === '#/admin') return 'admin';
    if (path === '/login' || hash === '#/login') return 'login';
    return 'register'; // By default, show register route
  });
  
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash === '#/admin') {
        setAuthRoute('admin');
        setIsRegistering(false);
      }
      else if (hash === '#/login') {
        setAuthRoute('login');
        setIsRegistering(false);
      }
      else if (hash === '#/registration' || path === '/register') {
        setAuthRoute('register');
        setIsRegistering(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [registerForm, setRegisterForm] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return { phone: '', code: '', password: '', confirmParams: '', invitationCode: params.get('ref') || '', agreed: false };
  });
  const referralLink = `${window.location.origin}/register?ref=${currentUser?.referralCode}`;

  // Removed auto-login effect to allow logout
  // useEffect(() => {
  //   if (!currentUser) {
  //     login("1234567890", "password123");
  //   }
  // }, [currentUser, login]);

  useEffect(() => {
    if (activeModal === "bankDetails" && banksList.length === 0) {
      setIsLoadingBanks(true);
      setTimeout(() => {
        setBanksList([
          { code: "044", name: "Access Bank" },
          { code: "011", name: "First Bank of Nigeria" },
          { code: "058", name: "Guaranty Trust Bank" },
          { code: "033", name: "United Bank for Africa (UBA)" },
          { code: "057", name: "Zenith Bank" },
          { code: "100004", name: "Opay" },
          { code: "100039", name: "Moniepoint" },
          { code: "100033", name: "PalmPay" },
          { code: "090267", name: "Kuda Bank" }
        ]);
        setIsLoadingBanks(false);
      }, 1200);
    }
  }, [activeModal, banksList.length]);

  useEffect(() => {
    if (activeModal === "addProduct" && productTypesList.length === 0) {
      setIsLoadingProductTypes(true);
      setTimeout(() => {
        setProductTypesList([
          { value: "general", label: "General" },
          { value: "vip", label: "VIP" },
          { value: "special", label: "Special" },
        ]);
        setIsLoadingProductTypes(false);
      }, 1000);
    }
  }, [activeModal, productTypesList.length]);

  const now = new Date();
  const MONTH = now.getMonth(); 
  const YEAR = now.getFullYear();
  const MONTH_LABEL = MONTH + 1;
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
  const firstDayWeekday = new Date(YEAR, MONTH, 1).getDay(); 
  const today = now.getDate();

  const BONUSES = {
    7: 1400,
    15: 2800,
    30: 4200
  };
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getCheckinTaskId = (day: number) => `checkin_${YEAR}-${String(MONTH + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const getBonusTaskId = (days: number) => `bonus_${YEAR}-${String(MONTH + 1).padStart(2, '0')}-${days}`;

  const checkedDays = useMemo(() => {
    const set = new Set<number>();
    if (!currentUser?.claimedTasks) return set;
    for (let i = 1; i <= Math.min(today, daysInMonth); i++) {
      if (currentUser.claimedTasks.includes(getCheckinTaskId(i))) {
        set.add(i);
      }
    }
    return set;
  }, [currentUser?.claimedTasks, YEAR, MONTH, today, daysInMonth]);

  const continuousStreak = useMemo(() => {
    let streak = 0;
    for (let i = today; i >= 1; i--) {
      if (checkedDays.has(i)) {
        streak++;
      } else if (i === today) {
        // Not checked in today yet, continue counting from yesterday
      } else {
        break; // Gap found before today
      }
    }
    return streak;
  }, [checkedDays, today]);

  const earnedBonuses = useMemo(() => {
    const bonuses: number[] = [];
    if (!currentUser?.claimedTasks) return bonuses;
    if (currentUser.claimedTasks.includes(getBonusTaskId(7))) bonuses.push(7);
    if (currentUser.claimedTasks.includes(getBonusTaskId(15))) bonuses.push(15);
    if (currentUser.claimedTasks.includes(getBonusTaskId(30))) bonuses.push(30);
    return bonuses;
  }, [currentUser?.claimedTasks, YEAR, MONTH]);

  const totalEarnings = useMemo(() => {
    let earn = 0;
    earnedBonuses.forEach(b => earn += BONUSES[b as keyof typeof BONUSES] || 0);
    return earn;
  }, [earnedBonuses]);

  const isCheckedInToday = checkedDays.has(today);

  const handleCheckIn = async () => {
    if (isCheckedInToday) return;

    let newStreak = continuousStreak + 1;
    let extraEarn = 0;
    let bonusMessage = "";

    // Check if we hit a bonus streak
    if (BONUSES[newStreak as keyof typeof BONUSES] && !earnedBonuses.includes(newStreak)) {
      const bonus = BONUSES[newStreak as keyof typeof BONUSES];
      extraEarn += bonus;
      bonusMessage = ` Bonus claimed! +₦${bonus}`;
      
      // We will claim the bonus task id as well
      claimTask(getBonusTaskId(newStreak), bonus);
    }

    // Call store to save the checkin and give the reward
    claimTask(getCheckinTaskId(today), 0);

    if (bonusMessage) {
      setToastMessage(`Checked in!${bonusMessage}`);
    } else {
      setToastMessage(`Checked in! Keep your streak going to earn bonuses.`);
    }
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const checkinCellCount = firstDayWeekday + daysInMonth;

  // Hide registration and login screen for now
  /* 
  if (!currentUser) { ... } 
  */

  const teamSize = currentUser
    ? users.filter((u) => u.referredBy === currentUser.referralCode).length
    : 0;

  const actualVipIndex = currentUser?.vipLevelIndex || 0;
  const [viewVipIndex, setViewVipIndex] = useState<number>(actualVipIndex);
  
  // Keep view in sync if actual level changes
  useEffect(() => {
    setViewVipIndex(actualVipIndex);
  }, [actualVipIndex]);

  const currentVipIndex = viewVipIndex;
  const currentVipLevel = VIP_LEVELS[currentVipIndex];
  const nextVipLevel = VIP_LEVELS[currentVipIndex + 1] || null;
  
  const isViewingCurrentLevel = viewVipIndex === actualVipIndex;

  // They only get credit for verified active referrals who have an active investment
  const currentReferrals = currentUser
    ? users.filter((u) => u.referredBy === currentUser.referralCode && investments.some(i => i.userId === u.id && i.status === 'active')).length
    : 0;
  const requiredReferrals = nextVipLevel ? nextVipLevel.requiredFromPrev : 0;
  
  // Calculate progress relative to the current actual level they are on
  let referralsInCurrentLevel = currentReferrals - VIP_LEVELS[actualVipIndex].requiredTotal;
  if (referralsInCurrentLevel < 0) referralsInCurrentLevel = 0;
  
  const canUpgrade = isViewingCurrentLevel && nextVipLevel && currentReferrals >= nextVipLevel.requiredTotal;
  
  const handleUpgradeVip = () => {
    if (canUpgrade) {
      upgradeVip();
      setActiveModal("levelUp");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount) {
      setIsProcessing(true);
      setTimeout(() => {
        requestDeposit(Number(depositAmount));
        setDepositAmount("");
        setIsProcessing(false);
        setActiveModal(null);
      }, 1000);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();
    const amountNum = Number(withdrawAmount);
    if (amountNum < 6000) {
      alert("Minimum withdrawal is ₦6,000");
      return;
    }
    
    if (!currentUser?.bankDetails) {
      alert("Please add your bank details first.");
      return;
    }

    const userVipLevel = VIP_LEVELS[currentUser.vipLevelIndex || 0];

    const { bankName: userBankName, accountNumber: userAccountNum } = currentUser.bankDetails;

    if (withdrawAmount && userBankName && userAccountNum) {
      if (currentUser && currentUser.balance < amountNum) {
        triggerVisualNotification("insufficient_balance", "INSUFFICIENT BALANCE", "Please recharge your account");
        return;
      }
      setShowWithdrawConfirm(true);
    }
  };

  const executeWithdrawal = async () => {
    setShowWithdrawConfirm(false);
    const amountNum = Number(withdrawAmount);
    const { bankName: userBankName, accountNumber: userAccountNum, accountName: userAccountName } = currentUser!.bankDetails!;
    
    setIsProcessing(true);
    try {
      requestWithdrawal(amountNum, {
        bankName: userBankName,
        accountNumber: userAccountNum,
        accountName: userAccountName,
      });
      setIsProcessing(false);
      setWithdrawAmount("");
      setSuccessAnimTitle("Withdrawal Requested");
      setSuccessAnimMessage("Withdrawal request submitted! Awaiting CBN/SEC confirmation.");
      setSuccessAnimAmount(amountNum);
      setActiveModal("successAnimated");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (err: any) {
      console.error(err);
      alert("Failed to submit withdrawal request.");
      setIsProcessing(false);
      setWithdrawAmount("");
      setActiveModal(null);
    }
  };

  const handleInvest = (
    planName: string,
    min: number,
    roi: number,
    days: number,
    productType: "general" | "vip" | "special",
    fixedDailyReturn?: number,
    tPlusDays?: number,
    quantity?: number
  ) => {
    if (!currentUser) return;
    
    const userVipLevel = VIP_LEVELS[currentUser.vipLevelIndex || 0];
    if (productType === "vip" && userVipLevel.levelIndex === 0) {
      alert(`This is a VIP product. You must be at least VIP1 to invest.`);
      return;
    }

    if (planName === "VIP team exclusive project") {
      const aLevelSubordinates = users.filter(u => u.referredBy === currentUser.referralCode).length;
      if (aLevelSubordinates < 30) {
        alert("You need at least 30 team members to purchase the VIP team exclusive project.");
        return;
      }
    }

    if (planName === "VIP Member Exclusive Project" || planName === "VIP team exclusive project") {
      const hasPurchased = investments.some(inv => inv.userId === currentUser.id && inv.planName === planName);
      if (hasPurchased) {
        alert("You have already reached the quota for this project.");
        return;
      }
    }

    const totalAmount = min * (quantity || 1);

    if (currentUser.balance < totalAmount) {
      triggerVisualNotification("insufficient_balance", "INSUFFICIENT BALANCE", "Please recharge your account");
      return;
    }
    createInvestment(planName, totalAmount, roi, days, fixedDailyReturn, tPlusDays, quantity);
    triggerVisualNotification("purchase_success", "PURCHASE SUCCESSFUL", "Thank you for choosing Equinor");
  };

  const formatOfferDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  if (!currentUser) {
    if (authRoute === 'admin') {
      return (
        <div className="h-[100dvh] md:min-h-screen bg-[#0A0E2E] flex justify-center items-center md:py-4 relative font-sans overflow-hidden">
          <div className="w-full max-w-[480px] h-full md:h-[95vh] bg-[#0A0E2E] md:rounded-[2.5rem] overflow-hidden shadow-2xl relative border-0 md:border-[6px] border-[#1a1e4e]/50 flex flex-col p-6 items-center justify-center">
            <h1 className="text-white text-2xl font-bold mb-8">Admin Portal</h1>
            <div className="w-full flex flex-col space-y-4">
              <input 
                type="text" 
                placeholder="Admin Email"
                value={loginIdentifier}
                onChange={e => setLoginIdentifier(e.target.value)}
                className="w-full bg-[#1a1e4e]/30 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#6B2EFF]"
              />
              <input 
                type="password" 
                placeholder="Password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-[#1a1e4e]/30 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#6B2EFF]"
              />
              <button 
                onClick={() => {
                  if (!loginIdentifier || !loginPassword) return alert("Enter credentials");
                  login(loginIdentifier, loginPassword);
                }}
                className="w-full bg-[#6B2EFF] text-white py-4 rounded-full font-bold text-lg mt-4 active:scale-95 transition-transform"
              >
                Log in as Admin
              </button>
            </div>
            <button
               onClick={() => {
                 window.location.hash = '';
                 setAuthRoute('login');
               }}
               className="mt-8 text-white/50 text-sm font-semibold hover:text-white"
            >
               Return to User Login
            </button>
          </div>
        </div>
      );
    }

    if (isRegistering || authRoute === 'register') {
      return (
        <div className="h-[100dvh] md:min-h-screen bg-[#0A0E2E] flex justify-center items-center md:py-4 relative font-sans overflow-hidden">
          <div className="w-full max-w-[480px] h-full md:h-[95vh] bg-[#0A0E2E] md:rounded-[2.5rem] overflow-hidden shadow-2xl relative border-0 md:border-[6px] border-[#1a1e4e]/50 flex flex-col p-6">
            <div className="flex bg-[#1a1e4e]/50 rounded-full p-1 mb-8">
              <button 
                onClick={() => {
                  window.location.hash = '#/login';
                  setIsRegistering(false);
                }} 
                className="flex-1 py-3 text-white/50 font-semibold rounded-full w-1/2"
              >
                Log In
              </button>
              <button className="flex-1 bg-[#6B2EFF] text-white py-3 font-semibold rounded-full w-1/2 shadow-lg">
                Registration
              </button>
            </div>

            <div className="flex-1 flex flex-col space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Please enter phone number"
                  value={registerForm.phone}
                  onChange={e => setRegisterForm({...registerForm, phone: e.target.value.replace(/\s/g, '')})}
                  className="w-full bg-[#1a1e4e]/30 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#6B2EFF]"
                />
              </div>

              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Please enter the password"
                  value={registerForm.password}
                  onChange={e => setRegisterForm({...registerForm, password: e.target.value})}
                  className="w-full bg-[#1a1e4e]/30 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#6B2EFF]"
                />
              </div>
              
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Please enter the confirm Password"
                  value={registerForm.confirmParams}
                  onChange={e => setRegisterForm({...registerForm, confirmParams: e.target.value})}
                  className="w-full bg-[#1a1e4e]/30 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#6B2EFF]"
                />
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Please enter the invitation code"
                  value={registerForm.invitationCode}
                  onChange={e => setRegisterForm({...registerForm, invitationCode: e.target.value})}
                  className="w-full bg-[#1a1e4e]/30 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#6B2EFF]"
                />
              </div>

              <div 
                className="flex items-center gap-2 mt-4 cursor-pointer"
                onClick={() => setRegisterForm({...registerForm, agreed: !registerForm.agreed})}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${registerForm.agreed ? 'border-[#6B2EFF] bg-[#6B2EFF]' : 'border-white/30 bg-transparent'}`}>
                  {registerForm.agreed && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-white/60 text-sm">I read and agree</span>
                <span className="text-[#6B2EFF] text-sm" onClick={(e) => { e.stopPropagation(); setActiveModal('privacy'); }}>【Privacy agreement】</span>
              </div>

              <button 
                onClick={() => {
                  if (!registerForm.agreed) {
                    alert("Please read and agree to the Privacy agreement.");
                    return;
                  }
                  if (!registerForm.phone || !registerForm.password) {
                    alert("Please fill in phone number and password.");
                    return;
                  }
                  if (registerForm.password !== registerForm.confirmParams) {
                    alert("Passwords do not match.");
                    return;
                  }
                  if (!registerForm.invitationCode || registerForm.invitationCode.trim() === '') {
                    alert("Please enter the invitation code.");
                    return;
                  }
                  signup(registerForm.phone, registerForm.password, registerForm.invitationCode);
                }}
                className="w-full bg-[#6B2EFF] text-white py-4 rounded-full font-bold text-lg mt-8 active:scale-95 transition-transform"
              >
                Sign up
              </button>
            </div>
            
            {/* Privacy Modal in Register View */}
            {activeModal === "privacy" && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 rounded-[2.5rem]">
                <div className="bg-[#141a3a] border border-white/10 p-6 rounded-[2rem] w-full max-w-sm relative shadow-2xl max-h-[90vh] flex flex-col">
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveModal(null); }}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white/50 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                  <h3 className="text-xl font-bold mb-4 text-[#00D4FF]">Privacy Agreement</h3>
                  
                  <div className="overflow-y-auto pr-2 scrollbar-hide flex-1 space-y-4 text-white/80 text-sm leading-relaxed">
                    <p>Welcome to our platform. This Privacy Policy sets out how we use and protect any information that you give us when you use this website.</p>
                    <p>We are committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.</p>
                    <p className="font-bold text-white mt-4">1. Information Collection</p>
                    <p>We may collect your phone number, registration details, and other information necessary for providing our investment services.</p>
                    <p className="font-bold text-white mt-4">2. Use of Information</p>
                    <p>We require this information to understand your needs and provide you with a better service, and in particular for internal record keeping and transactional purposes.</p>
                    <p className="font-bold text-white mt-4">3. Security</p>
                    <p>We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.</p>
                  </div>
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRegisterForm(prev => ({...prev, agreed: true}));
                        setActiveModal(null);
                      }}
                      className="w-full h-12 bg-gradient-to-r from-[#00D4FF] to-[#3B82F6] rounded-full text-white font-bold tracking-wide active:scale-95 transition-transform"
                    >
                      Agree & Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="h-[100dvh] md:min-h-screen bg-[#0A0E2E] flex justify-center items-center md:py-4 relative font-sans overflow-hidden">
        <div className="w-full max-w-[480px] h-full md:h-[95vh] bg-[#0A0E2E] md:rounded-[2.5rem] overflow-hidden shadow-2xl relative border-0 md:border-[6px] border-[#1a1e4e]/50 flex flex-col p-6">
          <div className="flex bg-[#1a1e4e]/50 rounded-full p-1 mb-8">
            <button className="flex-1 bg-[#6B2EFF] text-white py-3 font-semibold rounded-full shadow-lg">
              Log In
            </button>
            <button 
              onClick={() => {
                window.location.hash = '#/registration';
                setIsRegistering(true);
              }}
              className="flex-1 py-3 text-white/50 font-semibold rounded-full"
            >
              Registration
            </button>
          </div>

          <div className="flex-1 flex flex-col space-y-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Please enter phone number"
                value={loginIdentifier}
                onChange={e => setLoginIdentifier(e.target.value.replace(/\s/g, ''))}
                className="w-full bg-[#1a1e4e]/30 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#6B2EFF]"
              />
            </div>

            <div className="relative">
              <input 
                type="password" 
                placeholder="Please enter the password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-[#1a1e4e]/30 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#6B2EFF]"
              />
            </div>

            <button 
              onClick={() => {
                if (!loginIdentifier || !loginPassword) {
                  alert("Please fill in phone number and password.");
                  return;
                }
                login(loginIdentifier, loginPassword);
              }}
              className="w-full bg-[#6B2EFF] text-white py-4 rounded-full font-bold text-lg mt-8 active:scale-95 transition-transform"
            >
              Log in
            </button>
            <div className="mt-4 text-center">
              <button className="text-white/50 text-sm hover:text-white">
                Forgot your password?
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayBalance = currentUser.balance;

  return (
    <div className="h-[100dvh] md:min-h-screen bg-[#0A0E2E] flex justify-center items-center md:py-4 relative overflow-hidden">
      <div className="w-full max-w-[480px] h-full md:h-[95vh] bg-[#0A0E2E] md:rounded-[2.5rem] overflow-hidden shadow-2xl relative border-0 md:border-[6px] border-[#1a1e4e]/50 flex flex-col font-sans">
        
        {/* Gradients used for SVG Icons */}
        <svg width="0" height="0" className="absolute pointer-events-none">
          <defs>
            <linearGradient id="purpleG" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7B61FF" />
              <stop offset="100%" stopColor="#9C6BFF" />
            </linearGradient>
          </defs>
        </svg>

        {activeTab === "checkin" && (
          <div className="absolute inset-0 z-50 bg-[#0a0a1a] flex flex-col font-sans text-white overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between py-3.5 px-4 bg-[#0a0a1a] sticky top-0 z-20 w-full flex-shrink-0">
              <button 
                onClick={() => setActiveTab("home")}
                className="text-[22px] text-white w-8 text-left bg-transparent border-none cursor-pointer"
              >
                ←
              </button>
              <div className="text-[18px] font-semibold">Checkin</div>
              <div className="w-8"></div>
            </div>

            <div className="flex-1 w-full relative flex flex-col pt-0">
              {/* Daily Service */}
              <div className="bg-[#7b5cff] pt-5 px-4 pb-[30px] w-full flex-shrink-0">
                <div className="text-center text-[16px] font-medium mb-1">Daily service</div>
                <div className="text-center text-[18px] font-bold text-[#ffd24d] mb-1">Continuous sign-in {continuousStreak}</div>
                <div className="text-center text-[14px] font-medium text-[#e0e0ff] mb-6">Total earned: ₦{totalEarnings}</div>

                {/* Weekdays */}
                <div className="grid grid-cols-7 mb-3">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                    <div key={d} className="text-center text-[14px] font-medium text-white">{d}</div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-3 mb-6 whitespace-nowrap min-h-[200px]">
                  {Array.from({ length: checkinCellCount }, (_, i) => {
                    const isPadding = i < firstDayWeekday;
                    const day = i - firstDayWeekday + 1;
                    if (isPadding) {
                      return <div key={`padding-${i}`} className="aspect-square bg-transparent border-none rounded-xl"></div>;
                    }

                    const checked = checkedDays.has(day);
                    const isBonusDay = [7, 15, 30].includes(day);

                    return (
                      <div key={day} className={`aspect-square border rounded-xl relative flex items-end justify-center pb-1.5 ${checked ? "bg-[#a88cff] border-white" : "bg-[#a88cff]/50 border-white/40"}`}>
                        {checked && (
                          <div className="absolute top-1 w-[18px] h-[18px] bg-[#ffd24d] rounded-full flex items-center justify-center text-[12px] font-bold text-white leading-none">
                            ✓
                          </div>
                        )}
                        {isBonusDay && (
                          <div className="absolute -top-1.5 -right-1.5 bg-[#4ade80] text-[#0a0a1a] text-[9px] font-bold px-1 py-0.5 rounded-md leading-none shadow-sm">
                            ₦{BONUSES[day as keyof typeof BONUSES]}
                          </div>
                        )}
                        <div className="text-[12px] font-medium text-white">{MONTH_LABEL}.{day}</div>
                      </div>
                    );
                  })}
                </div>

                <button 
                  onClick={handleCheckIn}
                  disabled={isCheckedInToday}
                  className="w-full bg-[#d9cfff] border-none rounded-[30px] py-[14px] text-[16px] font-semibold text-[#6b5bff] cursor-pointer active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isCheckedInToday ? "Checked in" : "Check in"}
                </button>
              </div>

              {/* Toast */}
              {toastMessage && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#4ade80] text-[#0a0a1a] px-5 py-2.5 rounded-full font-bold text-sm shadow-xl z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                  {toastMessage}
                </div>
              )}

              {/* Rules */}
              <div className="bg-[#0f0f1f] rounded-t-[24px] pt-6 px-5 pb-10 -mt-[20px] flex-1 w-full relative z-10 min-h-[300px]">
                <div className="text-center text-[18px] font-semibold mb-4 text-white">Sign-in rules</div>
                <div className="text-[#4ade80] text-[14px] leading-[22px] mb-2.5">1. Log in to your account every day and click Log In.</div>
                <div className="text-[#4ade80] text-[14px] leading-[22px] mb-2.5">2. By logging in for 7 consecutive days, you can earn a ₦1400 bonus.</div>
                <div className="text-[#4ade80] text-[14px] leading-[22px] mb-2.5">3. By logging in for 15 consecutive days, you can earn a ₦2800 bonus.</div>
                <div className="text-[#4ade80] text-[14px] leading-[22px] mb-2.5">4. By logging in for 30 consecutive days, you can earn a ₦4200 bonus.</div>
                <div className="text-[#ef4444] text-[14px] leading-[22px] mt-3">
                  Note:<br/>
                  If the continuous login process is interrupted, it will be reset and cleared at the beginning of the month.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "task" && (() => {
          const claimedInfo = currentUser?.claimedTasks || [];
          
          const inviteCount = users.filter(u => u.referredBy === currentUser?.referralCode).length;
          const myInvestments = investments.filter(inv => inv.userId === currentUser?.id);
          const hasBigFirstInvest = myInvestments.length > 0 && myInvestments[0].amount >= 250000;
          const cumulativeInvest = myInvestments.reduce((sum, inv) => sum + inv.amount, 0);
          const currentVip = currentUser?.vipLevelIndex || 0;

          const tasks = [
            { id: "task1", title: "Invite registration", desc: `Invite 10 friends to register reward N1500 (${inviteCount}/10)`, reward: 1500, done: inviteCount >= 10 },
            { id: "task2", title: "First invest", desc: `First investment >= ₦250000 projects award ₦25000`, reward: 25000, done: hasBigFirstInvest },
            { id: "task3", title: "Cumulative investment", desc: `Accumulated investment ₦1500000 Reward ₦100000 (${cumulativeInvest}/1500000)`, reward: 100000, done: cumulativeInvest >= 1500000 },
            { id: "task4", title: "VIP level", desc: `Upgrade to VIP2 to receive reward ₦40000`, reward: 40000, done: currentVip >= 2 },
            { id: "task5", title: "Register and top up", desc: `Invite 20 friends to register and get 15000 Naira top-up bonus (${inviteCount}/20)`, reward: 15000, done: inviteCount >= 20 },
          ];

          const totalNotReceived = tasks.filter(t => !claimedInfo.includes(t.id)).reduce((sum, t) => sum + t.reward, 0);

          return (
          <div className="absolute inset-0 z-50 bg-[#0A0E2E] flex flex-col font-sans text-white overflow-y-auto w-full h-full pb-safe">
            {/* Header */}
            <div className="flex items-center py-4 px-4 sticky top-0 z-20 bg-[#0A0E2E]/90 backdrop-blur w-full flex-shrink-0 relative">
              <div className="flex items-center gap-2 cursor-pointer absolute left-4" onClick={() => setActiveTab("home")}>
                <ChevronLeft className="w-6 h-6 text-white" />
                <span className="text-white text-sm font-medium">₦{Number(currentUser?.balance || 0).toLocaleString()}</span>
              </div>
              <div className="flex-1 text-center font-bold text-[17px]">Task</div>
              <div className="absolute right-4 text-white">
                <Gift className="w-6 h-6" />
              </div>
            </div>

            {/* Sub-header */}
            <div className="px-5 py-3">
              <div className="text-[#F6E05E] text-sm font-medium">Not received: ₦{totalNotReceived}</div>
            </div>

            {/* Task List */}
            <div className="flex-1 px-4 pb-6 space-y-2.5">
              {tasks.map(task => {
                const isClaimed = claimedInfo.includes(task.id);
                return (
                  <div key={task.id} className="bg-white rounded-xl py-3 px-4 flex justify-between items-center shadow-md">
                    <div className="flex-1 pr-3">
                      <h3 className="text-[#0A0E2E] font-bold text-[14px] mb-0.5">{task.title}</h3>
                      <p className="text-slate-500 text-[11px] leading-[1.2] mb-1">{task.desc}</p>
                      <div className="text-[#DD6B20] font-bold text-[15px]">+₦{task.reward}</div>
                    </div>
                    {isClaimed ? (
                      <button disabled className="bg-gray-300 text-gray-500 px-4 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap shadow-sm">
                        Received
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          if (!task.done) {
                            alert("Task not completed yet.");
                            return;
                          }
                          claimTask(task.id, task.reward);
                          alert(`Successfully claimed ₦${task.reward} bonus!`);
                        }}
                        className={`${task.done ? 'bg-[#7B2FF7]' : 'bg-gray-400'} text-white px-4 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap active:scale-95 transition-transform shadow-sm`}
                      >
                        To receive
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        );
        })()}

        {activeTab === "vip" && (
          <div className="absolute inset-0 z-50 bg-gradient-to-b from-[#1A237E] to-[#0D1333] flex flex-col font-sans text-white overflow-y-auto w-full h-full pb-safe">
            {/* Header */}
            <div className="flex items-center h-[56px] px-4 sticky top-0 z-20 w-full flex-shrink-0 relative bg-gradient-to-b from-[#1A237E] to-[#1A237E]/90 backdrop-blur-md">
              <button className="flex items-center justify-center cursor-pointer absolute left-4 active:scale-95" onClick={() => setActiveTab("home")}>
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <div className="flex-1 text-center font-semibold text-[18px]">VIP</div>
            </div>

            {/* Content  */}
            <div className="flex-1 overflow-y-auto px-6 pb-8 relative flex flex-col items-center">
              
              {/* Stepper */}
              <div className="w-full flex items-center justify-between py-6 relative z-10">
                <div className="absolute top-[34px] left-[10%] right-[10%] h-[2px] bg-white/40 -z-10" />
                {VIP_LEVELS.slice(Math.max(0, Math.min(currentVipIndex - 1, VIP_LEVELS.length - 4)), Math.max(0, Math.min(currentVipIndex - 1, VIP_LEVELS.length - 4)) + 4).map((level, idx, arr) => {
                  const isActive = level.levelIndex === currentVipIndex;
                  const isPast = level.levelIndex < currentVipIndex;
                  
                  return (
                    <div 
                      key={level.name} 
                      className={`flex flex-col items-center gap-2 z-10 relative cursor-pointer active:scale-95 transition-transform`}
                      onClick={() => setViewVipIndex(level.levelIndex)}
                    >
                      <div className={`w-3 h-3 rounded-full border-[2px] flex items-center justify-center ${isActive ? 'bg-[#FFB300] border-[#FFB300] shadow-[0_0_10px_#FFB300]' : (isPast ? 'bg-white border-white' : 'bg-[#1A237E] border-white text-transparent')}`} />
                      <span className={`text-[12px] font-normal ${isActive || isPast ? "text-white" : "text-white/60"}`}>{level.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* Tier Badge Hero */}
              <div className="relative w-full py-4 flex flex-col items-center justify-center mb-4">
                <div className="absolute w-[160px] h-[160px] bg-[#E91E63]/40 blur-[20px] rounded-full mix-blend-screen -z-10" />
                <RankBadge rankName={currentVipLevel.name} size={160} />
              </div>

              {/* Status Card */}
              <div className="w-full bg-gradient-to-br from-[#FFD54F] to-[#FFB300] rounded-[16px] p-4 shadow-xl relative overflow-hidden mb-6">
                
                <div className="flex items-center gap-4 mb-5 relative z-10">
                  <button 
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    className="w-12 h-12 rounded-full border-2 border-white/50 bg-black/10 flex shrink-0 items-center justify-center shadow-sm overflow-hidden relative cursor-pointer"
                  >
                    {currentUser?.avatar ? (
                      <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="text-white font-bold text-[8px] tracking-widest text-center leading-tight">EQ</div>
                    )}
                  </button>
                  <div className="flex flex-col justify-center flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#212121] font-medium text-[14px]">ID: {currentUser?.referralCode}</span>
                      <span className="bg-white/30 text-white text-[12px] uppercase font-medium px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/20 shadow-sm">{currentVipLevel.name}</span>
                    </div>
                    <span className="text-[#212121] text-[13px] font-normal">
                      {viewVipIndex < actualVipIndex ? `Progresso: ${VIP_LEVELS[viewVipIndex+1]?.requiredTotal || 0}/${VIP_LEVELS[viewVipIndex+1]?.requiredTotal || 0}` : (viewVipIndex > actualVipIndex ? `Progresso: ${currentReferrals}/${nextVipLevel?.requiredTotal || 0}` : `Progresso: ${currentReferrals}/${nextVipLevel?.requiredTotal || 0}`)}
                    </span>
                  </div>
                </div>

                {viewVipIndex < actualVipIndex ? (
                  <button 
                    disabled
                    className="w-full min-h-[44px] py-2 bg-black/10 text-[#212121] rounded-[12px] font-semibold flex items-center justify-center px-4 relative z-10 transition-colors">
                    <span className="text-[14px]">Level Unlocked</span>
                  </button>
                ) : viewVipIndex > actualVipIndex ? (
                  <button 
                    disabled
                    className="w-full min-h-[44px] py-2 bg-black/10 text-[#212121]/50 rounded-[12px] font-semibold flex items-center justify-center px-4 relative z-10 transition-colors">
                    <span className="text-[14px]">Reach {currentVipLevel.name} first</span>
                  </button>
                ) : nextVipLevel ? (
                  canUpgrade ? (
                    <button 
                      onClick={handleUpgradeVip}
                      className="w-full min-h-[44px] py-2 bg-gradient-to-r from-[#7B1FA2] to-[#9C27B0] text-white rounded-[12px] font-semibold flex items-center justify-center px-4 active:scale-95 transition-transform shadow-[0_4px_10px_rgba(156,39,176,0.3)] relative z-10">
                      <span className="text-[14px]">Upgrade to {nextVipLevel.name}</span>
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="w-full min-h-[44px] py-2 bg-gradient-to-r from-[#7B1FA2] to-[#9C27B0] text-white/90 rounded-[12px] font-semibold flex items-center justify-center px-4 relative z-10 opacity-70 cursor-not-allowed">
                      <span className="text-[14px] leading-tight text-center">Update with {nextVipLevel.requiredTotal} active friends to become {nextVipLevel.name} ({currentReferrals}/{nextVipLevel.requiredTotal})</span>
                    </button>
                  )
                ) : (
                  <button 
                    disabled
                    className="w-full min-h-[44px] py-2 bg-black/10 text-[#212121] rounded-[12px] font-semibold flex items-center justify-center px-4 relative z-10 transition-colors">
                    <span className="text-[14px]">Max Level Reached</span>
                  </button>
                )}
              </div>

              {/* Benefits Section */}
              <div className="w-full flex justify-start">
                <div className="flex flex-col gap-4 text-left">
                  <h3 className="text-[#FFB300] font-medium text-[15px] mb-2">{currentVipLevel.name} Privileges</h3>
                  
                  <p className="text-white/85 font-normal text-[14px] leading-relaxed">
                    Exclusive {currentVipLevel.name} Member Project available.
                  </p>
                  
                  {VIP_MEMBER_EXCLUSIVE_TIERS[currentVipLevel.name] && (
                    <>
                      <p className="text-white/85 font-normal text-[14px] leading-relaxed">
                        Earn extra ₦{VIP_MEMBER_EXCLUSIVE_TIERS[currentVipLevel.name].dailyIncome.toLocaleString()}/day (total value ₦{VIP_MEMBER_EXCLUSIVE_TIERS[currentVipLevel.name].totalRevenue.toLocaleString()}).
                      </p>
                    </>
                  )}
                  
                  {EQUITY_EXCHANGE_TIERS[currentVipLevel.name] && (
                    <p className="text-white/85 font-normal text-[14px] leading-relaxed">
                      EQ smart wallet transaction limit of ₦{EQUITY_EXCHANGE_TIERS[currentVipLevel.name].get24h.toLocaleString()}/day. ({EQUITY_EXCHANGE_TIERS[currentVipLevel.name].discount}% discount)
                    </p>
                  )}
                  
                  {nextVipLevel && (
                    <button
                      onClick={handleUpgradeVip}
                      disabled={!canUpgrade}
                      className="w-full mt-4 h-[44px] bg-gradient-to-r from-[#FFB300] to-[#FFD54F] text-[#212121] rounded-[12px] font-semibold flex items-center justify-center px-4 active:scale-95 transition-transform shadow-[0_4px_10px_rgba(255,179,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-[14px]">
                        {canUpgrade ? `Congratulations! Upgrade to ${nextVipLevel.name}` : `Need ${nextVipLevel.requiredTotal} friends to reach ${nextVipLevel.name}`}
                      </span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
        {/* Top Navigation */}
        {activeTab !== "order" && activeTab !== "home" && (
          <div className="flex items-center justify-center h-[48px] relative z-10 shrink-0 bg-[#0A0E2E]/80 backdrop-blur-xl gap-2">
            <EquinorStar className="w-5 h-5 text-white" />
            <h1
              className="text-[18px] font-semibold tracking-widest uppercase text-white"
            >
              EQUINOR
            </h1>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-6 scrollbar-hide z-10 relative">
          
          {/* Hidden File Input for Avatar */}
          <input 
            type="file" 
            id="avatar-upload" 
            hidden 
            accept="image/*" 
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const url = await processImageUpload(file);
                  updateAvatar(url);
                } catch (error) {
                  console.error("Failed to upload avatar", error);
                }
              }
            }}
          />

          {activeTab === "home" && (
            <>
              {/* Floating Prize Draw */}
              <button 
                onClick={() => {
                  playNotificationSound('chime');
                  setActiveModal("prizeDraw");
                }}
                className="absolute right-0 top-[200px] z-50 flex items-center justify-center animate-bounce group active:scale-95 transition-transform"
                style={{ animationDuration: '3.5s' }}
              >
                <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-l-2xl border-y border-l border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] pr-0">
                  <div className="bg-gradient-to-br from-[#5D3FD3] to-[#4B0082] w-12 h-12 rounded-xl rounded-r-none flex items-center justify-center shadow-inner relative overflow-hidden border border-white/10 border-r-0">
                    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-white/5 skew-y-12 transform origin-bottom-left" />
                    <Crown className="w-6 h-6 text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] relative z-10" style={{ strokeWidth: 2 }} />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[#FFC107] to-[#F57F17] rounded-full flex items-center justify-center border-[1.5px] border-white z-20">
                      <span className="text-white font-black text-[7px]">$</span>
                    </div>
                  </div>
                </div>
              </button>

            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E2E] to-[#1C0F3F] flex flex-col font-sans overflow-y-auto overflow-x-hidden scrollbar-hide pb-32 z-20">
              
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 h-[48px] sticky top-0 z-20 bg-[#0A0E2E]/80 backdrop-blur-xl shrink-0">
                {/* Logo left / Avatar */}
                <button 
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  className="w-8 h-8 rounded-full bg-white flex shrink-0 items-center justify-center shadow-sm overflow-hidden relative p-0 cursor-pointer group"
                >
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full relative z-10" />
                  ) : (
                    <div className="w-full h-full relative overflow-hidden flex items-center justify-center z-0">
                      <EquinorStar className="w-[120%] h-[120%] absolute -translate-x-[2%]" />
                    </div>
                  )}
                </button>
                {/* Center text */}
                <div className="flex items-center justify-center gap-2">
                  <EquinorStar className="w-5 h-5 text-white" />
                  <div className="text-center font-semibold tracking-widest text-[18px] text-white">
                    EQUINOR
                  </div>
                </div>
                {/* Right Headphones */}
                <div 
                  onClick={() => setActiveModal("contact")}
                  className="w-8 h-8 rounded-full bg-white flex shrink-0 items-center justify-center cursor-pointer"
                >
                  <Headphones className="w-4 h-4 text-[#7B61FF]" />
                </div>
              </div>

              {/* Content area */}
              <div className="space-y-3 relative z-10 pt-2 flex flex-col flex-1 shrink-0">
                {/* Notification Banner */}
                <div className="bg-[#2E2E4A]/80 backdrop-blur-sm rounded-full px-4 mb-2 flex items-center gap-3 shadow-md h-[40px] overflow-hidden mx-4">
                  <Bell className="w-4 h-4 shrink-0 text-white/70" />
                  <div className="relative h-full flex-1 overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
                    <div className="flex flex-col absolute top-0 left-0 w-full animate-scroll-notifications hover:[animation-play-state:paused] active:[animation-play-state:paused]">
                      {[
                        "Congratulations to user 81****663 who received $595 income 3 hours ago.",
                        "User 90****221 just withdrew $12,500 successfully.",
                        "New VIP limit unlocked for user 70****992.",
                        "User 80****105 received $3,000 invitation bonus.",
                        "System update: Faster withdrawal processing activated.",
                        "Congratulations to user 81****663 who received $595 income 3 hours ago.",
                        "User 90****221 just withdrew $12,500 successfully.",
                        "New VIP limit unlocked for user 70****992.",
                        "User 80****105 received $3,000 invitation bonus.",
                        "System update: Faster withdrawal processing activated.",
                      ].map((text, idx) => (
                        <div key={idx} className="h-[40px] text-white/80 text-[11px] truncate font-medium flex items-center shrink-0">
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Slideshow Carousel */}
                {currentUser?.role === "admin" && (
                  <div className="px-4 mb-4">
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg border border-white/10 hover:from-blue-600 hover:to-indigo-700 active:scale-95 transition-all text-sm tracking-wide relative flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-5 h-5 text-white" />
                      View Support Chats
                      {chatMessages.filter(m => m.receiverId === currentUser?.id || (!m.receiverId && m.senderId !== currentUser?.id)).length > 0 && (
                        <span className="absolute right-4 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                          {chatMessages.filter(m => !m.receiverId && m.senderId !== currentUser?.id).length}
                        </span>
                      )}
                    </button>
                  </div>
                )}
                {carouselImages && carouselImages.length > 0 && (
                  <div className="w-full h-[180px] rounded-[20px] overflow-hidden relative mx-0 mx-4" style={{ width: 'calc(100% - 32px)' }}>
                    <div className="absolute inset-0 flex whitespace-nowrap animate-scroll-carousel w-max max-w-none">
                      {/* Duplicate the images to create a seamless loop */}
                      {[...carouselImages, ...carouselImages].map((img, idx) => (
                        <div key={idx} className="h-full w-screen shrink-0 relative px-0" style={{ maxWidth: 'calc(100vw - 32px)',  width: '400px'}}>
                          <img 
                            src={img} 
                            alt="Carousel banner" 
                            className="w-full h-full object-cover rounded-[20px]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {currentUser?.role === "admin" && (
                  <div className="flex flex-col gap-2">
                    <div className="w-full bg-white/5 border-2 border-dashed border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors relative overflow-hidden group">
                      <input 
                        type="file" 
                        title="Upload Carousel Image" 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const url = await processImageUpload(file);
                              addCarouselImage(url);
                            } catch (error) {
                              console.error("Failed to upload carousel image", error);
                            }
                          }
                        }}
                      />
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <ArrowUpCircle className="w-5 h-5 text-[#00D4FF]" />
                      </div>
                      <span className="text-white/90 text-[12px] font-bold tracking-wide uppercase">Admin: Add Carousel Slide</span>
                    </div>

                    {carouselImages.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full">
                        {carouselImages.map((img, idx) => (
                          <div key={idx} className="relative w-24 h-16 shrink-0 rounded-lg overflow-hidden border border-white/20 shadow-md">
                            <img src={img} className="w-full h-full object-cover" />
                            <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 removeCarouselImage(idx);
                               }}
                               className="absolute top-1 right-1 w-5 h-5 bg-red-500/90 hover:bg-red-600 rounded-full flex items-center justify-center text-white cursor-pointer z-20"
                            >
                               <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {promoImage && (
                  <div className="w-full rounded-[24px] overflow-hidden shadow-lg relative border border-white/10">
                    {currentUser?.role === "admin" && (
                      <button 
                        onClick={() => setPromoImage(null)}
                        className="absolute top-3 right-3 z-20 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <img src={promoImage} alt="Promotional Graphic" className="w-full h-auto object-cover" />
                  </div>
                )}

                {currentUser?.role === "admin" && (
                  <div className="w-full bg-white/5 border-2 border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors relative overflow-hidden group">
                    <input 
                      type="file" 
                      title="Upload Image" 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const url = await processImageUpload(file);
                            setPromoImage(url);
                          } catch (error) {
                            console.error("Failed to upload promo image", error);
                          }
                        }
                      }}
                    />
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <ArrowUpCircle className="w-6 h-6 text-[#7B2FFF]" />
                    </div>
                    <span className="text-white/90 text-[13px] font-bold tracking-wide uppercase">Admin: Upload Graphic</span>
                    <span className="text-white/50 text-[11px] mt-1 text-center max-w-[220px]">Click or drag image to update promotional content</span>
                  </div>
                )}



                {/* Quick Action Grid */}
                <div className="flex flex-wrap justify-between gap-y-3 px-4 w-full">
                  <button onClick={() => setActiveTab("vip")} className="bg-[#F3F0FF] rounded-[20px] h-[72px] basis-[31%] flex-grow max-w-[32%] flex flex-col items-center justify-center active:opacity-80 transition-opacity">
                    <div className="mb-1"><Crown size={24} className="text-[#7B61FF]" style={{ strokeWidth: 1.5 }} /></div>
                    <span className="text-[#1E1F24] text-[12px] font-medium leading-[1.2]">VIP</span>
                  </button>
                  <button onClick={() => setActiveTab("task")} className="bg-[#F3F0FF] rounded-[20px] h-[72px] basis-[31%] flex-grow max-w-[32%] flex flex-col items-center justify-center active:opacity-80 transition-opacity">
                    <div className="mb-1"><Layers size={24} className="text-[#7B61FF]" style={{ strokeWidth: 1.5 }} /></div>
                    <span className="text-[#1E1F24] text-[12px] font-medium leading-[1.2]">Task</span>
                  </button>
                  <button onClick={() => setActiveTab("checkin")} className="bg-[#F3F0FF] rounded-[20px] h-[72px] basis-[31%] flex-grow max-w-[32%] flex flex-col items-center justify-center active:opacity-80 transition-opacity">
                    <div className="mb-1"><UserCheck size={24} className="text-[#7B61FF]" style={{ strokeWidth: 1.5 }} /></div>
                    <span className="text-[#1E1F24] text-[12px] font-medium leading-[1.2]">Check in</span>
                  </button>
                  <button onClick={() => setActiveModal("deposit")} className="bg-[#F3F0FF] rounded-[20px] h-[72px] basis-[48%] flex-grow max-w-[49%] flex flex-col items-center justify-center active:opacity-80 transition-opacity">
                    <div className="flex items-center gap-2">
                       <ArrowRightCircle size={24} className="text-[#7B61FF]" style={{ strokeWidth: 1.5 }} />
                       <span className="text-[#1E1F24] text-[13px] font-medium leading-[1.2]">Recharge</span>
                    </div>
                  </button>
                  <button onClick={() => setActiveModal("withdraw")} className="bg-[#F3F0FF] rounded-[20px] h-[72px] basis-[48%] flex-grow max-w-[49%] flex flex-col items-center justify-center active:opacity-80 transition-opacity">
                    <div className="flex items-center gap-2">
                       <CreditCard size={24} className="text-[#7B61FF]" style={{ strokeWidth: 1.5 }} />
                       <span className="text-[#1E1F24] text-[13px] font-medium leading-[1.2]">Withdrawal</span>
                    </div>
                  </button>
                </div>

                {/* Team Stats Card */}
                <div onClick={() => setActiveTab("myteam")} className="w-[calc(100%-32px)] mx-4 h-[72px] rounded-[16px] bg-gradient-to-r from-[#7B61FF] to-[#C26BFF] px-4 flex justify-between items-center text-white cursor-pointer active:opacity-80 transition-opacity">
                  <div className="flex flex-col">
                     <span className="text-white text-[14px] font-medium mb-0.5 opacity-70">Team size</span>
                     <span className="text-[24px] font-bold leading-none">{teamSize}</span>
                  </div>
                  <div className="text-[14px] font-medium flex items-center gap-1">
                    More <span className="tracking-tighter">&gt;&gt;</span>
                  </div>
                </div>

                {/* Earnings Overview Card */}
                <div className="bg-white rounded-t-[24px] rounded-b-none p-6 shadow-[0_8px_24px_rgba(0,0,0,0.15)] relative overflow-hidden mt-0 flex-1 min-h-[400px]">
                  <div className="flex flex-col items-center relative z-10 w-full h-full">
                    <span className="text-[#666666] text-[14px] font-medium mb-1 mt-2">Accrued income</span>
                    <span className="text-[#0A0E2E] text-[36px] font-black leading-none mb-6">₦ 0</span>
                    
                    <div className="flex gap-3 w-full">
                      <div className="flex-1 bg-[#F5EBFF] rounded-full py-2.5 flex flex-col items-center justify-center">
                        <span className="text-[#8A8A9E] text-[11px] font-medium mb-0.5">Today's earnings</span>
                        <span className="text-[#0A0E2E] text-[14px] font-bold">₦ 0</span>
                      </div>
                      <div className="flex-1 bg-[#F5EBFF] rounded-full py-2.5 flex flex-col items-center justify-center">
                        <span className="text-[#8A8A9E] text-[11px] font-medium mb-0.5">Yesterday's profit</span>
                        <span className="text-[#0A0E2E] text-[14px] font-bold">₦ 0</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -bottom-4 -right-1 opacity-80 pointer-events-none select-none w-20 h-20 -mr-2">
                     <div className="absolute bottom-6 right-4 w-10 h-7 bg-gradient-to-tr from-[#FFD700] to-[#FF8C00] rounded-md transform rotate-[-5deg] shadow-sm border border-white/20"></div>
                  </div>
                </div>

                {/* Commission Introduction Section */}
                <div className="mx-4 mt-4 mb-8 bg-[#1C0F3F] rounded-[24px] p-6 border border-white/5 relative overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                  <h3 className="text-white font-bold text-center text-[18px] mb-5">Commission & VIP Introduction</h3>
                  
                  <div className="text-[#4ade80] text-[13px] leading-[1.5] mb-6 space-y-4">
                    <div>
                      <span className="font-bold text-white mb-1 block">How to earn commission</span>
                      <p>
                        All the friends you invite are A-level subordinates. You can get 10% commission of their investment.
                      </p>
                      <p className="mt-2">
                        The friends invited by your A-level subordinates are your B-level subordinates. The friends invited by your B-level subordinates are your C-level subordinates. You can get 1% commission of their investment.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <span className="font-bold text-white mb-1 block">How to upgrade VIP/SVIP</span>
                      <p className="text-white/80">
                        <span className="text-[#FFD700] font-bold">VIP 1 – VIP 10:</span> Every time you invite 3 active subordinates to join, you will be upgraded to the next VIP level. Invite 30 active subordinates and you will be upgraded to VIP10.
                      </p>
                      <p className="mt-2 text-white/80">
                        <span className="text-[#4DA8FF] font-bold">SVIP 1 – SVIP 10:</span> After upgrading to VIP10, you can upgrade to SVIP once for every 5 active subordinates you invite. Invite 50 active subordinates total after VIP10 (80 overall) to reach SVIP10.
                      </p>
                      <p className="mt-2 text-[#FFB800] font-bold">
                        After reaching Crown level, further invites will immediately promote you to City Agent!
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-full py-2.5 px-5 flex justify-between items-center mb-6 shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                      <span className="text-[#0A0E2E] font-extrabold text-[13px]">A: 10%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                      <span className="text-[#0A0E2E] font-extrabold text-[13px]">B: 1%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                      <span className="text-[#0A0E2E] font-extrabold text-[13px]">C: 1%</span>
                    </div>
                  </div>

                  {/* Network Diagram Graphic */}
                  <div className="relative h-[160px] flex items-center justify-center mt-2">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] bg-[#7B2FFF] rounded-full blur-[40px] opacity-40"></div>
                     <div className="relative z-10 w-24 h-14 bg-gradient-to-tr from-[#FFD700] to-[#FF8C00] rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.5)] flex items-center justify-center border-2 border-white/40 transform scale-110">
                        <span className="font-black text-white text-[20px] drop-shadow-md italic tracking-wider">VIP</span>
                     </div>
                     
                     {/* Nodes */}
                     <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 160">
                        <path d="M 150 80 L 80 130" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M 150 80 L 150 140" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M 150 80 L 220 130" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="4 4" />
                        
                        <circle cx="80" cy="130" r="14" fill="#2DD4BF" className="drop-shadow-[0_0_10px_rgba(45,212,191,0.8)]" /> 
                        <circle cx="150" cy="140" r="14" fill="#3B82F6" className="drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" /> 
                        <circle cx="220" cy="130" r="14" fill="#A855F7" className="drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" /> 

                        <text x="80" y="134" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">A</text>
                        <text x="150" y="144" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">B</text>
                        <text x="220" y="134" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">C</text>
                     </svg>
                  </div>
                </div>

              </div>
            </div>
          </>
          )}

          {activeTab === "myteam" && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E2E] to-[#1C0F3F] flex flex-col font-sans overflow-y-auto overflow-x-hidden scrollbar-hide pb-24 z-50">
              
              {/* My Team Dashboard Section */}
              <div className="px-5 mt-4 space-y-5 pb-8 relative z-10 pt-10">
                {(() => {
                  const levelAReferrals = currentUser ? users.filter(u => u.referredBy === currentUser.referralCode) : [];
                  const levelAIds = levelAReferrals.map(u => u.referralCode);
                  const levelBReferrals = users.filter(u => u.referredBy && levelAIds.includes(u.referredBy));
                  const levelBIds = levelBReferrals.map(u => u.referralCode);
                  const levelCReferrals = users.filter(u => u.referredBy && levelBIds.includes(u.referredBy));
                  const allTeamUsers = [...levelAReferrals, ...levelBReferrals, ...levelCReferrals];
                  const allTeamUserIds = allTeamUsers.map(u => u.id);
                  const totalTeamSize = allTeamUserIds.length;

                  const teamRecharges = transactions.filter(t => t.type === 'deposit' && t.status === 'approved' && allTeamUserIds.includes(t.userId));
                  const totalTeamRechargeAmount = teamRecharges.reduce((sum, t) => sum + t.amount, 0);

                  const teamInvests = investments.filter(i => allTeamUserIds.includes(i.userId));
                  const totalTeamInvestAmount = teamInvests.reduce((sum, i) => sum + i.amount, 0);

                  const activeTeamUsers = allTeamUserIds.filter(id => investments.some(i => i.userId === id && i.status === 'active'));
                  const activePlayerCount = activeTeamUsers.length;

                  // Date calculations
                  const todayStart = new Date();
                  todayStart.setHours(0,0,0,0);
                  const yesterdayStart = new Date(todayStart);
                  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

                  const myCommissions = commissions.filter(c => c.userId === currentUser?.id);
                  const totalCommissionEarned = currentUser?.referralEarnings || 0;

                  const todayCommissions = myCommissions.filter(c => new Date(c.date) >= todayStart);
                  const totalTodayCommission = todayCommissions.reduce((sum, c) => sum + c.amount, 0);

                  const yesterdayCommissions = myCommissions.filter(c => {
                    const d = new Date(c.date);
                    return d >= yesterdayStart && d < todayStart;
                  });
                  const totalYesterdayCommission = yesterdayCommissions.reduce((sum, c) => sum + c.amount, 0);

                  return (
                    <>
                      {/* 1. Header */}
                <div className="flex items-center justify-center relative py-2">
                  <button onClick={() => setActiveTab("home")} className="absolute left-0 p-2 text-white/80 hover:text-white transition-colors">
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <span className="text-white font-bold text-[18px]">My team</span>
                </div>

                {/* 2. Main metric header */}
                <div className="flex justify-between items-center bg-[#1C0F3F] p-5 rounded-2xl border border-white/5 relative overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                  <div className="absolute top-[-50%] left-[-10%] w-32 h-32 bg-[#7B2FFF] blur-[50px] opacity-20 pointer-events-none rounded-full"></div>
                  
                        <div className="flex flex-col relative z-10">
                          <span className="text-white text-[12px] opacity-80 mb-1">Total commission</span>
                          <span className="text-white text-[28px] font-black">₦ {formatCurrency(totalCommissionEarned)}</span>
                        </div>
                  <div className="relative z-10 w-[52px] h-[52px] rounded-full flex items-center justify-center border-[2px] border-white/10 shadow-[0_0_15px_rgba(123,47,255,0.4)]" style={{ background: 'linear-gradient(135deg, rgba(123,47,255,0.2) 0%, rgba(77,168,255,0.2) 100%)' }}>
                    <Users className="w-[24px] h-[24px] text-[#4DA8FF]" />
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full border-2 border-[#1C0F3F]"></div>
                  </div>
                </div>

                {/* 3. Stats grid */}
                <div className="flex flex-col gap-3">
                        {/* Row 1 */}
                        <div className="flex gap-3">
                          <div className="flex-1 bg-white rounded-[16px] p-4 flex flex-col items-center justify-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                            <span className="text-[#7B2FFF] text-[18px] font-black leading-tight mb-0.5">₦ {formatCurrency(totalTeamRechargeAmount)}</span>
                            <span className="text-[#8A8A9E] text-[10px] font-bold">Team total<br/>recharge</span>
                          </div>
                          <div className="flex-1 bg-white rounded-[16px] p-4 flex flex-col items-center justify-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                            <span className="text-[#7B2FFF] text-[18px] font-black leading-tight mb-0.5">₦ {formatCurrency(totalTeamInvestAmount)}</span>
                            <span className="text-[#8A8A9E] text-[10px] font-bold">Total team<br/>invest</span>
                          </div>
                        </div>
                        {/* Row 2 */}
                        <div className="flex gap-3">
                          <div className="flex-1 bg-white rounded-[16px] p-3 flex flex-col items-center justify-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                            <span className="text-[#7B2FFF] text-[15px] font-black leading-tight mb-0.5">₦ {formatCurrency(totalYesterdayCommission)}</span>
                            <span className="text-[#8A8A9E] text-[9px] font-bold">Yesterday's<br/>commission</span>
                          </div>
                          <div className="flex-1 bg-white rounded-[16px] p-3 flex flex-col items-center justify-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                            <span className="text-[#7B2FFF] text-[15px] font-black leading-tight mb-0.5">₦ {formatCurrency(totalCommissionEarned)}</span>
                            <span className="text-[#8A8A9E] text-[9px] font-bold">Team<br/>Commission</span>
                          </div>
                          <div className="flex-1 bg-white rounded-[16px] p-3 flex flex-col items-center justify-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                            <span className="text-[#7B2FFF] text-[15px] font-black leading-tight mb-0.5">₦ {formatCurrency(totalTodayCommission)}</span>
                            <span className="text-[#8A8A9E] text-[9px] font-bold">Today's<br/>commission</span>
                          </div>
                        </div>
                </div>

                      {/* 4. Team size card */}
                      <div className="relative w-full mt-2">
                        <div className="absolute inset-0 bg-[#7B2FFF] blur-[25px] opacity-30 rounded-[20px]"></div>
                        <div className="relative bg-white rounded-[20px] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.2)] flex flex-col items-center w-full">
                          <span className="text-[#8A8A9E] text-[13px] font-bold mb-0.5">Team size</span>
                          <span className="text-[#0A0E2E] text-[36px] font-black leading-none mb-4">{totalTeamSize}</span>
                          
                          <div className="flex gap-3 w-full">
                            <div className="flex-1 bg-[#F5F7FA] rounded-2xl py-3 flex flex-col items-center justify-center">
                              <span className="text-[#0A0E2E] text-[18px] font-black leading-none mb-1">{activePlayerCount}</span>
                              <span className="text-[#8A8A9E] text-[10px] font-bold">Active player</span>
                            </div>
                            <div className="flex-1 bg-[#F5F7FA] rounded-2xl py-3 flex flex-col items-center justify-center">
                              <span className="text-[#0A0E2E] text-[18px] font-black leading-none mb-1">{allTeamUsers.filter(u => u.createdAt && new Date(u.createdAt) >= todayStart).length}</span>
                              <span className="text-[#8A8A9E] text-[10px] font-bold">Added today</span>
                            </div>
                          </div>
                          
                          {/* VIP Progress Bar */}
                          {(() => {
                            const currentVipIdx = currentUser?.vipLevelIndex || 0;
                            const currentVip = VIP_LEVELS[currentVipIdx];
                            const nextVipIdx = currentVipIdx + 1;
                            const nextVip = VIP_LEVELS[nextVipIdx];
                            
                            if (!nextVip) return null; // Max level reached
                            
                            const directReferralCount = levelAReferrals.filter((u) => investments.some((i) => i.userId === u.id && i.status === 'active')).length;
                            const requiredReferrals = nextVip.requiredTotal;
                            
                            const progressPct = Math.min(100, ((directReferralCount / requiredReferrals) * 100));
                            const remaining = Math.max(0, requiredReferrals - directReferralCount);
                            
                            return (
                              <div className="w-full mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-[#8A8A9E] font-bold pb-[2px]">Next Level: <span className="text-[#7B2FFF]">{nextVip.name}</span></span>
                                  <span className="text-[#0A0E2E] font-bold">{directReferralCount} / {requiredReferrals} Active Ref</span>
                                </div>
                                <div className="w-full bg-[#F5F7FA] rounded-full h-2.5 overflow-hidden">
                                  <div 
                                    className="bg-gradient-to-r from-[#4DA8FF] to-[#7B2FFF] h-full rounded-full transition-all duration-500" 
                                    style={{ width: `${progressPct}%` }}
                                  ></div>
                                </div>
                                <div className="text-center text-[10px] text-[#8A8A9E] font-bold mt-1">
                                  {remaining > 0 
                                    ? `You need ${remaining} more active direct referral${remaining > 1 ? 's' : ''} to reach ${nextVip.name}` 
                                    : 'You meet the referral requirements for the next VIP level!'}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Detailed Contributors Section */}
                      <div className="flex flex-col bg-[#1C0F3F] rounded-[20px] border border-white/5 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.3)] mt-2 p-5 relative">
                        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#4DA8FF] blur-[50px] opacity-20 pointer-events-none rounded-full"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                          <h3 className="text-white text-[16px] font-bold">Member Contributions</h3>
                          <span className="text-white/50 text-[12px] font-medium">Top Team Members</span>
                        </div>
                        
                        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 relative z-10 scrollbar-hide">
                          {(() => {
                            const membersWithContributions = allTeamUsers.map(user => {
                              const generatedComm = commissions
                                .filter(c => c.userId === currentUser?.id && c.fromUserId === user.id)
                                .reduce((sum, c) => sum + c.amount, 0);
                              
                              const userLevelStr = levelAIds.includes(user.referralCode) 
                                ? 'A' 
                                : (levelBIds.includes(user.referralCode) ? 'B' : 'C');
                                
                              return { ...user, generatedComm, userLevelStr };
                            }).sort((a, b) => b.generatedComm - a.generatedComm);

                            if (membersWithContributions.length === 0) {
                              return <div className="text-center text-white/40 text-[12px] font-medium py-4">No team members yet.</div>
                            }

                            return membersWithContributions.filter(m => m.generatedComm > 0).map((member, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-[12px]">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7B2FFF] to-[#4DA8FF] p-[2px]">
                                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-white text-[14px]">
                                      {member.name.charAt(0).toUpperCase()}
                                    </div>
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className="text-white text-[14px] font-bold tracking-wide">{member.referralCode}</span>
                                      <span className="text-[9px] font-bold bg-[#4DA8FF]/20 text-[#4DA8FF] px-1.5 py-0.5 rounded tracking-wider">LVL {member.userLevelStr}</span>
                                    </div>
                                    <span className="text-white/50 text-[11px] font-medium font-mono tracking-wider mt-0.5">{member.phone || "No phone"}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="text-[#4DA8FF] text-[14px] font-black tracking-tight">+₦{formatCurrency(member.generatedComm)}</span>
                                  <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider mt-0.5">Contribution</span>
                                </div>
                              </div>
                            )).concat(membersWithContributions.filter(m => m.generatedComm === 0).map((member, idx) => (
                              <div key={`z${idx}`} className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-[12px] opacity-60">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-white/10 p-[2px]">
                                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-white/50 text-[14px]">
                                      {member.name.charAt(0).toUpperCase()}
                                    </div>
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className="text-white text-[14px] font-bold tracking-wide">{member.referralCode}</span>
                                      <span className="text-[9px] font-bold bg-white/10 text-white/70 px-1.5 py-0.5 rounded tracking-wider">LVL {member.userLevelStr}</span>
                                    </div>
                                    <span className="text-white/50 text-[11px] font-medium font-mono tracking-wider mt-0.5">{member.phone || "No phone"}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="text-white/50 text-[14px] font-black tracking-tight">₦0</span>
                                  <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider mt-0.5">Contribution</span>
                                </div>
                              </div>
                            )));
                          })()}
                        </div>
                      </div>

                      {/* 5. Bottom navigation list */}
                      <div className="flex flex-col bg-[#1C0F3F] rounded-[20px] border border-white/5 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.3)] mt-2 mb-8">
                        <div className="flex border-b border-white/10 relative">
                          <div 
                            className={`absolute bottom-0 h-[3px] bg-[#7B2FFF] rounded-t-lg transition-transform duration-300 w-1/3 ${
                              activeTeamTab === "A" ? "left-0" : activeTeamTab === "B" ? "translate-x-full left-0" : "translate-x-[200%] left-0"
                            }`}
                          ></div>
                          <button onClick={() => setActiveTeamTab("A")} className={`flex-1 py-3 font-bold text-[14px] transition-colors ${activeTeamTab === "A" ? "text-white" : "text-white/50 hover:text-white/80"}`}>A ({levelAReferrals.length})</button>
                          <button onClick={() => setActiveTeamTab("B")} className={`flex-1 py-3 font-bold text-[14px] transition-colors ${activeTeamTab === "B" ? "text-white" : "text-white/50 hover:text-white/80"}`}>B ({levelBReferrals.length})</button>
                          <button onClick={() => setActiveTeamTab("C")} className={`flex-1 py-3 font-bold text-[14px] transition-colors ${activeTeamTab === "C" ? "text-white" : "text-white/50 hover:text-white/80"}`}>C ({levelCReferrals.length})</button>
                        </div>
                        
                        <div className="flex flex-col">
                          {(() => {
                              const activeReferrals = activeTeamTab === "A" ? levelAReferrals : activeTeamTab === "B" ? levelBReferrals : levelCReferrals;

                              if (activeReferrals.length === 0) {
                                return (
                                  <div className="py-8 text-center text-white/50 text-[13px] font-medium">
                                    No referrals in this level yet.
                                  </div>
                                );
                              }

                              return activeReferrals.map((user, index) => {
                                const rfInvests = investments.filter(i => i.userId === user.id);
                                const rfRecharges = transactions.filter(t => t.userId === user.id && t.type === 'deposit');
                                const active = rfInvests.length > 0;
                                return (
                                   <div key={index} className="flex items-center gap-3 p-4 bg-white/5 border-b border-white/5">
                                    <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-tr from-[#7B2FFF] to-[#4DA8FF] flex items-center justify-center shadow-lg p-[2px]">
                                      <div className="w-full h-full bg-black rounded-full flex items-center justify-center relative overflow-hidden">
                                        <div className="text-white font-bold text-[6px] tracking-wider text-center leading-tight">EQUINOR</div>
                                      </div>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-white text-[14px] font-bold tracking-wide">{user.referralCode} {active && <span className="ml-1 text-[8px] bg-[#4DA8FF] text-white px-1 py-0.5 rounded uppercase align-middle">Active</span>}</span>
                                      <span className="text-[#8A8A9E] text-[10px] font-medium mt-0.5">Reg: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                                      {user.phone && <span className="text-[#8A8A9E] text-[10px] font-medium mt-[2px]">Phone: {user.phone}</span>}
                                    </div>
                                    <div className="ml-auto flex flex-col items-end gap-1 mr-1">
                                       <div className="flex items-center gap-1 bg-[#FFA500]/10 px-2.5 py-1 rounded-full border border-[#FFA500]/30 w-fit">
                                         <Crown className="w-3.5 h-3.5 text-[#FFA500]" />
                                         <span className="text-[#FFA500] text-[10px] font-bold tracking-wide">VIP{user.vipLevelIndex || 0}</span>
                                       </div>
                                        <div className="text-right mt-1">
                                          <div className="text-white text-[10px] font-bold mb-0.5">Inv: ₦{formatCurrency(rfInvests.reduce((a,b)=>a+b.amount,0))}</div>
                                          <div className="text-white/70 text-[9px]">Dep: ₦{formatCurrency(rfRecharges.reduce((a,b)=>a+b.amount,0))}</div>
                                        </div>
                                    </div>
                                  </div>
                                )
                              });
                          })()}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {activeTab === "product" && (
            <div className="absolute inset-0 flex flex-col font-sans overflow-hidden z-20 bg-white">
              <div className="relative z-10 flex flex-col h-full w-full">
                {/* Tab Navigation directly beneath (Header removed) */}
                <div className="px-5 shrink-0 mb-4 mt-1 pt-6">
                <div className="flex justify-between items-center relative bg-[#F3F4F6] rounded-full p-1 border border-gray-100">
                  {(["general", "vip", "special"] as const).map((tab, idx) => {
                    const isActive = productTab === tab;
                    const labels = ["General", "VIP", "Special"];
                    return (
                      <button
                        key={tab}
                        onClick={() => setProductTab(tab)}
                        className={`text-[14px] font-bold py-2 relative w-1/3 text-center transition-colors rounded-full z-10 ${
                          isActive ? "text-white" : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {labels[idx]}
                        {isActive && (
                          <div className="absolute inset-0 bg-[#6B3CFF] rounded-full -z-10 shadow-sm" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Area */}
              {isLoadingProducts ? (
                <div className="flex-1 overflow-y-auto px-5 pb-[140px] space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.15)] overflow-hidden">
                      <div className="w-full h-[180px] sm:h-[220px] bg-slate-200 animate-pulse"></div>
                      <div className="p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                          <div className="h-6 w-24 bg-slate-200 rounded animate-pulse"></div>
                        </div>
                        <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse leading-none my-2"></div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div className="h-16 bg-slate-200 rounded-[14px] animate-pulse"></div>
                          <div className="h-16 bg-slate-200 rounded-[14px] animate-pulse"></div>
                        </div>
                        <div className="mt-2 h-12 bg-slate-200 rounded-[14px] animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.filter(p => p.type === productTab).length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center pb-32">
                  <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                    <EquinorStar className="w-24 h-24 text-white/20" />
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto px-5 pb-[140px] space-y-4">
                  {products.filter(p => p.type === productTab).map((plan) => {
                    let cost = plan.min;
                    let roi = plan.roi;
                    let get24h = 0;
                    
                    const promoDiff = plan.promotionalUnlockDate ? new Date(plan.promotionalUnlockDate).getTime() - Date.now() : 0;
                    const isPromoLocked = promoDiff > 0;
                    let promoTimerString = "";
                    if (isPromoLocked) {
                      const d = Math.floor(promoDiff / (1000 * 60 * 60 * 24));
                      const h = Math.floor((promoDiff / (1000 * 60 * 60)) % 24);
                      const m = Math.floor((promoDiff / 1000 / 60) % 60);
                      const s = Math.floor((promoDiff / 1000) % 60);
                      promoTimerString = `${d > 0 ? d + 'd ' : ''}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                    }

                    if (plan.type === 'vip' && plan.name === 'Equinor Equity Exchange Project' && currentUser) {
                      const userVipName = VIP_LEVELS[currentUser.vipLevelIndex || 0].name;
                      const tier = EQUITY_EXCHANGE_TIERS[userVipName] || EQUITY_EXCHANGE_TIERS["VIP1"];
                      cost = tier.cost;
                      roi = (tier.profit * 100) / tier.cost;
                      get24h = tier.get24h;
                    }

                    if (plan.name === 'VIP Member Exclusive Project' || plan.name === 'VIP team exclusive project') {
                      const isVipTeam = plan.name === 'VIP team exclusive project';
                      const mockInv = {
                        planName: plan.name,
                        amount: plan.min,
                        expectedRoi: plan.roi,
                        fixedDailyReturn: plan.fixedDailyReturn,
                      } as import('./store').Investment;
                      
                      const calculatedDailyReturn = getDailyIncome(mockInv, currentUser, users, investments);
                      const totalIncome = calculatedDailyReturn * plan.days;
                      
                      return (
                        <div key={plan.id} className="relative bg-white rounded-[20px] mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.15)] overflow-hidden">
                          {isPromoLocked ? (
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#00D4FF]/95 to-[#7B2FF7]/95 backdrop-blur-lg text-white py-6 z-20 shadow-[0_10px_40px_rgba(0,10,30,0.5)] flex flex-col items-center justify-center gap-2 border-y border-white/40">
                              <div className="flex items-center gap-2">
                                <Clock className="w-6 h-6 animate-pulse" /> 
                                <span className="text-sm font-bold tracking-widest uppercase">Unlocks In</span>
                              </div>
                              <span className="text-4xl sm:text-5xl font-black font-mono tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">{promoTimerString}</span>
                            </div>
                          ) : (
                            <div className="absolute top-0 right-0 bg-[#FF4D4F] text-white text-[10px] font-bold px-3 py-1 rounded-bl-[12px] z-20 shadow-sm leading-none uppercase tracking-widest">HOT</div>
                          )}
                          
                          {/* Image Header */}
                          <div className={`relative w-full h-[180px] sm:h-[220px] ${isVipTeam ? 'bg-gradient-to-r from-red-900 to-black' : 'bg-gradient-to-br from-[#1F2937] to-[#111827]'} flex items-center justify-center overflow-hidden`}>
                            {plan.imageUrl ? (
                              <img src={plan.imageUrl} alt={plan.name} className="w-full h-full object-cover" />
                            ) : isVipTeam ? (
                              <>
                                <div className="flex flex-col items-center justify-center z-10">
                                  <span className="text-[#FBBF24] font-black text-4xl tracking-widest drop-shadow-lg scale-y-110">VIP</span>
                                  <span className="text-white font-bold tracking-[0.3em] text-sm mt-1">GROUP</span>
                                </div>
                                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/20 to-transparent z-0"></div>
                                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent z-0"></div>
                              </>
                            ) : (
                              <>
                                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FBBF24] to-[#F59E0B] flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.6)] z-10">
                                  <span className="text-white font-bold text-2xl tracking-tighter">VIP</span>
                                </div>
                                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-3xl z-0"></div>
                                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#6366F1]/20 blur-3xl z-0"></div>
                              </>
                            )}
                          </div>
                          
                          <div className="p-3.5 sm:p-4 flex flex-col gap-3">
                            {/* Header Metadata Row */}
                            <div className="flex justify-start items-center">
                              <span className="bg-[#FFECEC] text-[#FF4D4F] px-4 py-1.5 rounded-full font-bold text-[12px]">
                                T+{plan.tPlusDays || 1}
                              </span>
                            </div>
                        
                            {/* Title */}
                            <h3 className="uppercase text-[18px] sm:text-[20px] font-semibold text-[#111827] tracking-tight leading-tight">
                              {plan.name}
                            </h3>
                        
                            {/* Financial Metrics Grid */}
                            <div className="flex flex-col gap-2 mt-1">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-[#EDE7FF] rounded-[14px] p-3 flex flex-col items-center justify-center text-center">
                                  <span className="text-[11px] text-[#5B3DF6]/80 font-medium mb-1">Daily income</span>
                                  <span className="text-[#5B3DF6] font-semibold text-[14px]">₦{calculatedDailyReturn.toLocaleString()}</span>
                                </div>
                                <div className="bg-[#EDE7FF] rounded-[14px] p-3 flex flex-col items-center justify-center text-center">
                                  <span className="text-[11px] text-[#5B3DF6]/80 font-medium mb-1">Cycle</span>
                                  <span className="text-[#5B3DF6] font-semibold text-[14px]">{plan.days} Days</span>
                                </div>
                              </div>
                              <div className="bg-[#EDE7FF] rounded-[14px] p-3 flex justify-between items-center px-4">
                                 <span className="text-[#5B3DF6]/80 text-[13px] font-medium">Price: ₦{plan.min.toLocaleString()}</span>
                                 <span className="text-[#5B3DF6] font-semibold text-[12px] uppercase">Quota: {plan.maxQuota || '∞'}</span>
                              </div>
                            </div>
                        
                            {/* CTA & Profit Display */}
                            <div className="flex justify-between items-center mt-3 pt-1">
                              <div className="flex flex-col">
                                <span className="text-[14px] text-[#6B7280] font-medium mb-0.5">Total income</span>
                                <span className="text-[#FF3B30] text-[20px] font-bold leading-none">₦{totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                              </div>
                              
                              <button 
                                onClick={() => {
                                  if (isPromoLocked) {
                                    alert("This product is currently locked for a promotional period.");
                                    return;
                                  }
                                  if (!currentUser) return;
                                  if (currentUser.balance < plan.min) {
                                    triggerVisualNotification("insufficient_balance", "INSUFFICIENT BALANCE", "Please recharge your account");
                                    return;
                                  }

                                  if (plan.type === "vip" && VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex === 0) {
                                    alert("This is a VIP product. You must be at least VIP1 to invest.");
                                    return;
                                  }
                                  
                                  if (isVipTeam) {
                                    const aLevelSubordinates = users.filter(u => u.referredBy === currentUser.referralCode).length;
                                    if (aLevelSubordinates < 30) {
                                      alert("You need at least 30 team members to purchase the VIP team exclusive project.");
                                      return;
                                    }
                                  }
                                  
                                  const hasPurchased = investments.some(inv => inv.userId === currentUser.id && inv.planName === plan.name);
                                  if (hasPurchased) {
                                    alert("You have already reached the quota for this project.");
                                    return;
                                  }
                                  
                                  setEquinorSelectedPlan({ ...plan, buyAmount: plan.min, calculatedRoi: plan.min > 0 ? (calculatedDailyReturn / plan.min) * 100 : 0 });
                                  setBuyingQuantity("1");
                                  setActiveModal("equinorConfirm");
                                }}
                                className={isPromoLocked ? "bg-slate-300 text-slate-500 px-8 md:px-10 h-[48px] rounded-[24px] font-bold text-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-not-allowed transform transition" : "bg-gradient-to-r from-[#8A63FF] to-[#C26BFF] text-white px-8 md:px-10 h-[48px] rounded-[24px] font-bold text-[16px] shadow-[0_4px_12px_rgba(138,99,255,0.4)] transform transition active:scale-[0.98]"}
                              >
                                {isPromoLocked ? "Locked" : "Buy"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (plan.type === 'vip' && plan.name === 'Equinor Equity Exchange Project') {
                      return (
                        <div key={plan.id} className="relative bg-white rounded-[20px] mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.15)] overflow-hidden">
                          {isPromoLocked ? (
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#00D4FF]/95 to-[#7B2FF7]/95 backdrop-blur-lg text-white py-6 z-20 shadow-[0_10px_40px_rgba(0,10,30,0.5)] flex flex-col items-center justify-center gap-2 border-y border-white/40">
                              <div className="flex items-center gap-2">
                                <Clock className="w-6 h-6 animate-pulse" /> 
                                <span className="text-sm font-bold tracking-widest uppercase">Unlocks In</span>
                              </div>
                              <span className="text-4xl sm:text-5xl font-black font-mono tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">{promoTimerString}</span>
                            </div>
                          ) : (
                            <div className="absolute top-0 right-0 bg-[#FF4D4F] text-white text-[10px] font-bold px-3 py-1 rounded-bl-[12px] z-20 shadow-sm leading-none uppercase tracking-widest">HOT</div>
                          )}
                          
                          {/* Image Header */}
                          <div className={`relative w-full h-[180px] sm:h-[220px] bg-[#1E1E2D] flex items-center justify-center overflow-hidden`}>
                            {/* Simulated chart background */}
                            <svg viewBox="0 0 100 40" className="absolute bottom-0 w-full h-[80%] opacity-30" preserveAspectRatio="none">
                              <path d="M0,40 L0,20 L10,25 L20,15 L30,22 L40,10 L50,18 L60,5 L70,12 L80,2 L90,10 L100,0 L100,40 Z" fill="#28C76F" opacity="0.3" />
                              <polyline points="0,20 10,25 20,15 30,22 40,10 50,18 60,5 70,12 80,2 90,10 100,0" fill="none" stroke="#28C76F" strokeWidth="1" />
                            </svg>
                          </div>
                          
                          <div className="p-3.5 sm:p-4 flex flex-col gap-3">
                            {/* Header Metadata Row */}
                            <div className="flex justify-start items-center">
                              <span className="bg-[#FFECEC] text-[#FF4D4F] px-4 py-1.5 rounded-full font-bold text-[12px]">
                                T+{plan.tPlusDays || 1}
                              </span>
                            </div>
                        
                            {/* Title */}
                            <h3 className="uppercase text-[18px] sm:text-[20px] font-semibold text-[#111827] tracking-tight leading-tight">
                              {plan.name}
                            </h3>
                        
                            <div className="text-[#6E6B7B] text-[13px] leading-relaxed">
                              Participate in our VIP equity exchange program. Benefits are distributed after each 1-day cycle, with a minimum entry of ₦ {cost.toLocaleString()}. Advance to higher VIP tiers to increase your returns and discount rate.
                            </div>
                        
                            {/* Financial Metrics Grid */}
                            <div className="flex flex-col gap-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-[#EDE7FF] rounded-[14px] p-3 flex flex-col items-center justify-center text-center">
                                  <span className="text-[11px] text-[#5B3DF6]/80 font-medium mb-1">24H Returns</span>
                                  <span className="text-[#5B3DF6] font-semibold text-[14px]">₦{get24h.toLocaleString()}</span>
                                </div>
                                <div className="bg-[#EDE7FF] rounded-[14px] p-3 flex flex-col items-center justify-center text-center">
                                  <span className="text-[11px] text-[#5B3DF6]/80 font-medium mb-1">Cycle</span>
                                  <span className="text-[#5B3DF6] font-semibold text-[14px]">1 Days</span>
                                </div>
                              </div>
                            </div>
                        
                            {/* Input Field aligned to match general row size */}
                            <div className="flex flex-col">
                              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                                Enter Amount (Min ₦{cost.toLocaleString()})
                                {plan.maxQuota ? <span className="text-[#0052FF] text-[9px] font-bold tracking-wider bg-blue-50 px-1.5 py-0.5 rounded uppercase">Quota: {plan.maxQuota}</span> : null}
                              </span>
                              <div className="border border-gray-200 focus-within:border-[#8A63FF] rounded-[10px] px-3 py-3 mt-1 transition-colors flex items-center bg-[#F8F9FA]">
                                <span className="text-gray-500 font-bold mr-1">₦</span>
                                <input 
                                  type="number"
                                  placeholder={`${cost}`}
                                  value={equinorInputAmount}
                                  onChange={(e) => setEquinorInputAmount(e.target.value)}
                                  className="w-full bg-transparent outline-none font-mono text-gray-800 text-base font-semibold placeholder:font-normal placeholder-gray-400"
                                />
                              </div>
                            </div>
                        
                            {/* CTA & Profit Display equivalent */}
                            <div className="flex justify-end items-center mt-2">
                              <button 
                                onClick={() => {
                                  if (isPromoLocked) {
                                    alert("This product is currently locked for a promotional period.");
                                    return;
                                  }
                                  const amount = Number(equinorInputAmount) || cost;
                                  if (amount < cost) {
                                    alert(`Minimum amount is ₦${cost.toLocaleString()}`);
                                    return;
                                  }
                                  if (!currentUser) return;
                                  if (currentUser.balance < amount) {
                                    triggerVisualNotification("insufficient_balance", "INSUFFICIENT BALANCE", "Please recharge your account");
                                    return;
                                  }

                                  if (plan.type === "vip" && VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex === 0) {
                                    alert("This is a VIP product. You must be at least VIP1 to invest.");
                                    return;
                                  }

                                  setEquinorSelectedPlan({ ...plan, buyAmount: amount, calculatedRoi: roi });
                                  setBuyingQuantity("1");
                                  setActiveModal("equinorConfirm");
                                }}
                                className={isPromoLocked ? "bg-slate-300 text-slate-500 px-8 md:px-10 h-[48px] rounded-[24px] font-bold text-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-not-allowed transform transition" : "bg-gradient-to-r from-[#8A63FF] to-[#C26BFF] text-white px-8 md:px-10 h-[48px] rounded-[24px] font-bold text-[16px] shadow-[0_4px_12px_rgba(138,99,255,0.4)] transform transition active:scale-[0.98]"}
                              >
                                {isPromoLocked ? "Locked" : "Buy"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    const mockInv = {
                      planName: plan.name,
                      amount: plan.min,
                      expectedRoi: plan.roi,
                      fixedDailyReturn: plan.fixedDailyReturn,
                    } as import('./store').Investment;
                    const calculatedDailyReturn = getDailyIncome(mockInv, currentUser, users, investments);
                    const totalIncome = calculatedDailyReturn * plan.days;
                    
                    return (
                      <div key={plan.id} className="relative bg-white rounded-[20px] mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.15)] overflow-hidden">
                          {isPromoLocked ? (
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#00D4FF]/95 to-[#7B2FF7]/95 backdrop-blur-lg text-white py-6 z-20 shadow-[0_10px_40px_rgba(0,10,30,0.5)] flex flex-col items-center justify-center gap-2 border-y border-white/40">
                              <div className="flex items-center gap-2">
                                <Clock className="w-6 h-6 animate-pulse" /> 
                                <span className="text-sm font-bold tracking-widest uppercase">Unlocks In</span>
                              </div>
                              <span className="text-4xl sm:text-5xl font-black font-mono tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">{promoTimerString}</span>
                            </div>
                          ) : (
                            <div className="absolute top-0 right-0 bg-[#FF4D4F] text-white text-[10px] font-bold px-3 py-1 rounded-bl-[12px] z-20 shadow-sm leading-none uppercase tracking-widest">HOT</div>
                          )}
                        
                        {/* Image Header */}
                        <div className={`relative w-full h-[180px] sm:h-[220px] bg-gradient-to-br from-[#1F2937] to-[#111827] flex items-center justify-center overflow-hidden`}>
                          {plan.imageUrl ? (
                            <img src={plan.imageUrl} alt={plan.name} className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#4F46E5] flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.6)] z-10">
                                <span className="text-white font-bold text-3xl tracking-tighter">{plan.name.charAt(0).toUpperCase()}</span>
                              </div>
                              <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-3xl z-0"></div>
                              <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#6366F1]/20 blur-3xl z-0"></div>
                            </>
                          )}
                        </div>

                        <div className="p-3.5 sm:p-4 flex flex-col gap-3">
                          {/* Header Metadata Row */}
                          <div className="flex justify-start items-center">
                            <span className="bg-[#FFECEC] text-[#FF4D4F] px-4 py-1.5 rounded-full font-bold text-[12px]">
                              T+{plan.tPlusDays || 1}
                            </span>
                          </div>
                      
                          {/* Title */}
                          <h3 className="uppercase text-[18px] sm:text-[20px] font-semibold text-[#111827] tracking-tight leading-tight">
                            {plan.name}
                          </h3>
                      
                          {/* Financial Metrics Grid */}
                          <div className="flex flex-col gap-2 mt-1">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-[#EDE7FF] rounded-[14px] p-3 flex flex-col items-center justify-center text-center">
                                <span className="text-[11px] text-[#5B3DF6]/80 font-medium mb-1">Daily income</span>
                                <span className="text-[#5B3DF6] font-semibold text-[14px]">₦{calculatedDailyReturn.toLocaleString()}</span>
                              </div>
                              <div className="bg-[#EDE7FF] rounded-[14px] p-3 flex flex-col items-center justify-center text-center">
                                <span className="text-[11px] text-[#5B3DF6]/80 font-medium mb-1">Cycle</span>
                                <span className="text-[#5B3DF6] font-semibold text-[14px]">{plan.days} Days</span>
                              </div>
                            </div>
                            <div className="bg-[#EDE7FF] rounded-[14px] p-3 flex justify-between items-center px-4">
                               <span className="text-[#5B3DF6]/80 text-[13px] font-medium">Price: ₦{plan.min.toLocaleString()}</span>
                               <span className="text-[#5B3DF6] font-semibold text-[12px] uppercase">Quota: {plan.maxQuota || '∞'}</span>
                            </div>
                          </div>
                      
                          {/* CTA & Profit Display */}
                          <div className="flex justify-between items-center mt-3 pt-1">
                            <div className="flex flex-col">
                              <span className="text-[14px] text-[#6B7280] font-medium mb-0.5">Total income</span>
                              <span className="text-[#FF3B30] text-[20px] font-bold leading-none">₦{totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                            </div>
                            
                            <button 
                              onClick={() => {
                                if (isPromoLocked) {
                                  alert("This product is currently locked for a promotional period.");
                                  return;
                                }
                                if (!currentUser) return;
                                if (currentUser.balance < plan.min) {
                                  triggerVisualNotification("insufficient_balance", "INSUFFICIENT BALANCE", "Please recharge your account");
                                  return;
                                }

                                if (plan.type === "vip" && VIP_LEVELS[currentUser.vipLevelIndex || 0].levelIndex === 0) {
                                  alert("This is a VIP product. You must be at least VIP1 to invest.");
                                  return;
                                }
                                
                                setEquinorSelectedPlan({ ...plan, buyAmount: plan.min, calculatedRoi: plan.min > 0 ? (calculatedDailyReturn / plan.min) * 100 : 0 });
                                setBuyingQuantity("1");
                                setActiveModal("equinorConfirm");
                              }}
                              className={isPromoLocked ? "bg-slate-300 text-slate-500 px-8 md:px-10 h-[48px] rounded-[24px] font-bold text-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-not-allowed transform transition" : "bg-gradient-to-r from-[#8A63FF] to-[#C26BFF] text-white px-8 md:px-10 h-[48px] rounded-[24px] font-bold text-[16px] shadow-[0_4px_12px_rgba(138,99,255,0.4)] transform transition active:scale-[0.98]"}
                            >
                              {isPromoLocked ? "Locked" : "Buy"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            </div>
          )}

          {activeTab === "order" && (() => {
            const activeInvestments = investments.filter(inv => inv.status === "active" && inv.userId === currentUser?.id);
            
            const totalInvestmentAmount = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
            
            const totalCanBeCollected = activeInvestments.reduce((sum, inv) => {
              const now = new Date();
              const startDate = new Date(inv.startDate);
              const endDate = new Date(inv.endDate);
              const lastCollected = inv.lastCollectedDate ? new Date(inv.lastCollectedDate) : startDate;
              const msInADay = 1000 * 3600 * 24;
              
              const tPlusDays = inv.tPlusDays || 1;
              const msInCycle = msInADay * tPlusDays;
              const currentElapsedMs = Math.max(0, now.getTime() - lastCollected.getTime());
              const timeToCollectMs = Math.min(Math.min(currentElapsedMs, msInCycle), endDate.getTime() - lastCollected.getTime());
              
              const isCycleComplete = currentElapsedMs >= msInCycle || now.getTime() >= endDate.getTime();
              
              if (isCycleComplete) {
                const dailyIncome = getDailyIncome(inv, currentUser, users, investments);
                const profitAccrued = (timeToCollectMs / msInADay) * dailyIncome;
                
                const isFinished = (lastCollected.getTime() + timeToCollectMs) >= endDate.getTime();
                
                return sum + profitAccrued + (isFinished ? inv.amount : 0);
              }
              return sum;
            }, 0);

            const filteredInvestments = investments.filter(inv => {
              if (inv.userId !== currentUser?.id) return false;
              const now = new Date();
              const isExpired = inv.status === "completed" || now.getTime() >= new Date(inv.endDate).getTime();
              const product = products.find(p => p.name === inv.planName);
              const pType = product ? product.type : "general";
              
              if (orderTab === "expired") return isExpired;
              if (orderTab === "general") return !isExpired && pType === "general";
              if (orderTab === "vip") return !isExpired && pType === "vip";
              if (orderTab === "special") return !isExpired && pType === "special";
              return false;
            });

            const handleGetAll = async () => {
              let selectedCount = 0;
              let totalAmountCollected = 0;
              for (const inv of activeInvestments) {
                const invNow = new Date();
                const invStart = new Date(inv.startDate);
                const invEnd = new Date(inv.endDate);
                const invLastCollected = inv.lastCollectedDate ? new Date(inv.lastCollectedDate) : invStart;
                
                const invMsInADay = 1000 * 3600 * 24;
                const tPlusDays = inv.tPlusDays || 1;
                const msInCycle = invMsInADay * tPlusDays;
                
                const currentElapsed = Math.max(0, invNow.getTime() - invLastCollected.getTime());
                const timeToCollectMs = Math.min(Math.min(currentElapsed, msInCycle), invEnd.getTime() - invLastCollected.getTime());
                
                const isCycleComplete = currentElapsed >= msInCycle || invNow >= invEnd;
                if (inv.status === "active" && isCycleComplete) {
                  const res = await collectEarnings(inv.id, true);
                  if (res && res.success && res.amount) {
                    totalAmountCollected += res.amount;
                  }
                  selectedCount++;
                }
              }
              if (selectedCount > 0) {
                setSuccessAnimTitle("Income Collected!");
                setSuccessAnimMessage("All accrued profits collected successfully into your balance.");
                setSuccessAnimAmount(totalAmountCollected);
                setActiveModal("successAnimated");
              } else {
                addNotification("Info", "No new profits to collect.", "info");
              }
            };

            return (
              <div className="flex flex-col h-full absolute inset-0 z-0 bg-gradient-to-b from-[#0A0E2E] to-[#1C0F3F]">
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden z-0">
                  <EquinorStar className="w-[60vw] max-w-[300px] text-white absolute" />
                </div>
                <div className="relative z-10 p-4 pt-0 flex flex-col h-full overflow-hidden w-full max-w-md mx-auto">
                  {/* Logo Center */}
                  <div className="text-center h-[48px] flex justify-center items-center gap-2">
                    <EquinorStar className="w-5 h-5 text-white" />
                    <span className="text-[18px] font-semibold tracking-widest uppercase text-white">
                      EQUINOR
                    </span>
                  </div>

                  {/* Summary Cards outside scroll */}
                  <div className="flex gap-2 mb-3 shrink-0 z-10 w-full mt-2">
                    {/* Left Card */}
                    <div className="flex-1 bg-gradient-to-br from-[#FFB800] to-[#FFA000] rounded-[12px] p-3 text-white shadow-md flex flex-col justify-center min-w-0">
                      <div className="text-[14px] xs:text-[16px] font-black leading-tight mb-1 truncate">
                        ₦{totalInvestmentAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </div>
                      <div className="text-[10px] font-medium text-white/90 truncate uppercase tracking-wide">Total Investment</div>
                    </div>
                    {/* Right Card */}
                    <div className="flex-1 bg-gradient-to-br from-[#4DA8FF] to-[#00C9FF] rounded-[12px] p-3 text-white shadow-md flex flex-col justify-center min-w-0">
                      <div className="text-[14px] xs:text-[16px] font-black leading-tight mb-1 truncate">
                        ₦{totalCanBeCollected.toLocaleString(undefined, {minimumFractionDigits: 5, maximumFractionDigits: 5})}
                      </div>
                      <div className="text-[10px] font-medium text-white/90 truncate uppercase tracking-wide">Can be collected</div>
                    </div>
                  </div>

                  {activeInvestments.length > 0 && (
                    <button 
                      disabled={isProcessing}
                      onClick={async () => {
                        setIsProcessing(true);
                        await handleGetAll();
                        setTimeout(() => setIsProcessing(false), 1000);
                      }}
                      className={`w-full py-2.5 rounded-[12px] font-bold text-[14px] mb-3 shrink-0 z-10 shadow-md transition-transform flex justify-center items-center ${isProcessing ? 'opacity-80 scale-[0.98]' : ''} ${totalCanBeCollected > 0 ? 'bg-[#7B2FFF] text-white active:scale-[0.98]' : 'bg-[#7B2FFF]/50 text-white/80 active:scale-[1]'}`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                          </div>
                          <span>Collecting...</span>
                        </div>
                      ) : (
                        'Get All'
                      )}
                    </button>
                  )}

                  {/* Tab Navigation */}
                  <div className="flex w-full gap-2 mb-4 shrink-0 z-10">
                    {(["general", "vip", "special", "expired"] as const).map(tab => {
                      const isActive = orderTab === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setOrderTab(tab as any)}
                          className={`flex-1 py-2 text-[14px] relative focus:outline-none transition-all ${
                            isActive ? "text-white font-bold" : "text-gray-500 font-medium hover:text-gray-400"
                          }`}
                        >
                          <span className="capitalize">{tab === "vip" ? "VIP" : tab}</span>
                          {isActive && (
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-[#8A63FF] rounded-t-full shadow-[0_0_8px_rgba(138,99,255,0.6)]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex-1 overflow-y-auto w-full relative pb-[140px] flex flex-col custom-scrollbar">

                    <div className="flex-1 w-full relative z-10 space-y-4">
                    {isLoadingOrders ? (
                      <div className="w-full space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-white rounded-[16px] mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden">
                            <div className="w-full h-[140px] sm:h-[160px] bg-slate-200 animate-pulse"></div>
                            <div className="p-4 flex flex-col gap-3">
                              <div className="flex justify-between items-center">
                                <div className="h-5 w-12 bg-slate-200 rounded-full animate-pulse"></div>
                                <div className="h-5 w-24 bg-slate-200 rounded animate-pulse"></div>
                              </div>
                              <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse my-2"></div>
                              <div className="grid grid-cols-2 gap-3 mt-1">
                                <div className="h-16 bg-slate-200 rounded-[12px] animate-pulse"></div>
                                <div className="h-16 bg-slate-200 rounded-[12px] animate-pulse"></div>
                                <div className="h-16 bg-slate-200 rounded-[12px] animate-pulse"></div>
                                <div className="h-16 bg-slate-200 rounded-[12px] animate-pulse"></div>
                              </div>
                              <div className="h-12 w-full bg-slate-200 rounded-[12px] animate-pulse mt-2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : filteredInvestments.length === 0 ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center -mt-20">
                        <EquinorStar className="w-24 h-24 text-white/20 mb-4" />
                      </div>
                    ) : (
                      filteredInvestments.map(inv => {
                        const invNow = new Date();
                        const invStart = new Date(inv.startDate);
                        const invEnd = new Date(inv.endDate);
                        const invLastCollected = inv.lastCollectedDate ? new Date(inv.lastCollectedDate) : invStart;
                        const invMsInADay = 1000 * 3600 * 24;
                        const invCycleLength = Math.round((invEnd.getTime() - invStart.getTime()) / invMsInADay);
                        
                        const isExpired = invNow >= invEnd || inv.status === 'completed';
                        
                        const tPlusDays = inv.tPlusDays || 1;
                        const maxElapsedCycleMs = Math.min(tPlusDays * invMsInADay, invEnd.getTime() - invLastCollected.getTime());
                        const currentElapsedMs = Math.max(0, invNow.getTime() - invLastCollected.getTime());
                        
                        const msUntilNext = Math.max(0, maxElapsedCycleMs - currentElapsedMs);
                        const daysLeft = Math.floor(msUntilNext / invMsInADay);
                        const hoursLeft = Math.floor((msUntilNext / (1000 * 60 * 60)) % 24);
                        const minutesLeft = Math.floor((msUntilNext / 1000 / 60) % 60);
                        const secondsLeft = Math.floor((msUntilNext / 1000) % 60);
                        
                        const readingElapsedMs = Math.min(currentElapsedMs, maxElapsedCycleMs);
                        const dailyIncome = getDailyIncome(inv, currentUser, users, investments);
                        const profitAccrued = (readingElapsedMs / invMsInADay) * dailyIncome;
                        
                        const timeToCollectMs = Math.min(Math.min(currentElapsedMs, maxElapsedCycleMs), invEnd.getTime() - invLastCollected.getTime());
                        const isCycleComplete = currentElapsedMs >= maxElapsedCycleMs;
                        const canCollect = inv.status === "active" && isCycleComplete;
                        const product = products.find(p => p.name === inv.planName);
                        
                        return (
                          <div key={inv.id} className="relative bg-white rounded-[16px] mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden">
                            {/* Image Header */}
                            <div className="relative w-full h-[140px] sm:h-[160px] bg-[#111827] flex items-center justify-center overflow-hidden">
                              {product?.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-white font-bold text-4xl opacity-30">{inv.planName.charAt(0)}</span>
                              )}
                            </div>
                          
                            <div className="p-4 sm:p-5 flex flex-col gap-3">
                              {/* Header Metadata Row */}
                              <div className="flex justify-between items-center">
                                <span className="bg-[#FFECEC] text-[#FF4D4F] px-3 py-1 rounded-full font-bold text-[11px]">
                                  T+{inv.tPlusDays || 1}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] font-mono tracking-wider text-[#6B7280]">CP{new Date(inv.startDate).getTime()}{inv.id.substring(0, 4)}</span>
                                  <div className="opacity-40">
                                     <Barcode className="w-10 h-5 text-black" strokeWidth={1} />
                                  </div>
                                </div>
                              </div>
                          
                              {/* Title & Timeline */}
                              <div className="flex flex-col gap-2">
                                <h3 className="uppercase text-[16px] font-bold text-[#111827] tracking-tight leading-tight line-clamp-1">
                                  {inv.planName}
                                </h3>
                                
                                <div className="flex flex-col mt-1">
                                  <div className="flex flex-col">
                                    <span className="text-[11px] text-[#6B7280] font-medium">Start:</span>
                                    <span className="text-[12px] text-[#111827] font-semibold">{new Date(inv.startDate).toLocaleString([], {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</span>
                                  </div>
                                  <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                      <span className="text-[11px] text-[#6B7280] font-medium">End:</span>
                                      <span className="text-[12px] text-[#111827] font-semibold">{new Date(invEnd).toLocaleString([], {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    {!isExpired && (
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <div className="bg-black text-white font-bold text-[11px] w-7 h-7 rounded flex items-center justify-center">{daysLeft.toString().padStart(2, '0')}d</div>
                                        <div className="bg-black text-white font-bold text-[11px] w-7 h-7 rounded flex items-center justify-center">{hoursLeft.toString().padStart(2, '0')}h</div>
                                        <div className="bg-black text-white font-bold text-[11px] w-7 h-7 rounded flex items-center justify-center">{minutesLeft.toString().padStart(2, '0')}m</div>
                                        <div className="bg-black text-white font-bold text-[11px] w-7 h-7 rounded flex items-center justify-center">{secondsLeft.toString().padStart(2, '0')}s</div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                          
                              {/* Financial Metrics Grid */}
                              <div className="flex flex-col gap-3 mt-2">
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="bg-[#EDE7FF] rounded-[12px] p-2 flex flex-col items-center justify-center text-center">
                                    <span className="text-[10px] text-[#5B3DF6]/80 font-medium mb-0.5">Daily income</span>
                                    <span className="text-[#5B3DF6] font-semibold text-[13px] truncate w-full">₦{dailyIncome.toLocaleString()}</span>
                                  </div>
                                  <div className="bg-[#EDE7FF] rounded-[12px] p-2 flex flex-col items-center justify-center text-center">
                                    <span className="text-[10px] text-[#5B3DF6]/80 font-medium mb-0.5">Cycle</span>
                                    <span className="text-[#5B3DF6] font-semibold text-[13px] truncate w-full">{inv.tPlusDays || 1} Days</span>
                                  </div>
                                  <div className="bg-[#EDE7FF] rounded-[12px] p-2 flex flex-col items-center justify-center text-center">
                                    <span className="text-[10px] text-[#5B3DF6]/80 font-medium mb-0.5">Total income</span>
                                    <span className="text-[#5B3DF6] font-semibold text-[13px] truncate w-full">₦{(dailyIncome * (inv.tPlusDays || 1)).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="bg-[#EDE7FF] rounded-[12px] p-2.5 flex justify-between items-center px-4">
                                   <span className="text-[#5B3DF6]/80 text-[12px] sm:text-[13px] font-medium break-all mr-2">Price: ₦{inv.amount.toLocaleString()}</span>
                                   <span className="text-[#5B3DF6] font-semibold text-[12px] sm:text-[13px] break-all text-right">Payment: ₦{inv.amount.toLocaleString()}</span>
                                </div>
                              </div>
                          
                              {/* CTA & Profit Display */}
                              <div className="flex justify-between items-center mt-3 pt-1">
                                <div className="flex flex-col">
                                  <span className="text-[14px] text-[#6B7280] font-medium mb-0.5">Live generated income</span>
                                  <span className="text-[#FF3B30] text-[20px] font-bold leading-none">+₦{profitAccrued.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 5})}</span>
                                </div>
                                
                                {canCollect ? (
                                  <button 
                                    disabled={collectingIds[inv.id]}
                                    onClick={async () => {
                                      setCollectingIds(prev => ({ ...prev, [inv.id]: true }));
                                      const res = await collectEarnings(inv.id, true);
                                      if (res && res.success) {
                                        setSuccessAnimTitle("Income Collected!");
                                        setSuccessAnimMessage(`Profits for ${inv.planName} collected successfully.`);
                                        setSuccessAnimAmount(res.amount || null);
                                        setActiveModal("successAnimated");
                                      } else {
                                        if (res && res.message) {
                                          addNotification("Info", res.message, "info");
                                        }
                                      }
                                      setTimeout(() => {
                                        setCollectingIds(prev => ({ ...prev, [inv.id]: false }));
                                      }, 1000);
                                    }}
                                    className={`bg-gradient-to-r from-[#EC4899] to-[#F43F5E] text-white px-8 md:px-10 h-[48px] rounded-[24px] font-bold text-[16px] shadow-[0_4px_12px_rgba(236,72,153,0.4)] transform transition flex flex-col justify-center items-center ${collectingIds[inv.id] ? 'opacity-80 scale-95' : 'active:scale-[0.98]'}`}
                                  >
                                    {collectingIds[inv.id] ? (
                                      <div className="flex items-center gap-2">
                                        <div className="relative flex h-3 w-3">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                        </div>
                                        <span>...</span>
                                      </div>
                                    ) : (
                                      'Get'
                                    )}
                                  </button>
                                ) : isExpired ? (
                                  <span className="text-[#34C759] font-bold px-6 py-2.5 border border-[#34C759]/20 rounded-[24px] bg-[#34C759]/5 text-[15px]">{inv.status === 'completed' ? 'Completed' : 'Expired'}</span>
                                ) : (
                                  <button 
                                    disabled
                                    className="bg-gray-100 text-gray-400 px-8 md:px-10 h-[48px] rounded-[24px] font-bold text-[16px] cursor-not-allowed"
                                  >
                                    Waiting
                                  </button>
                                )}
                              </div>
                          
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
             </div>
            );
          })()}

          {activeTab === "mine" && (
            <div className="pb-6 relative z-10 w-full max-w-md mx-auto">
              {/* Profile Header */}
              <div className="flex justify-between items-center px-4 mb-5 mt-5">
                <div className="flex items-center gap-3">
                  <button 
                    className="w-10 h-10 shrink-0 rounded-full border-[2px] border-[#7B2FFF]/50 flex items-center justify-center overflow-hidden bg-white shadow-[0_4px_15px_rgba(123,47,255,0.3)] relative group p-0 transition-transform active:scale-95"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <span className="text-white text-[7px] font-bold">CHANGE</span>
                    </div>
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover relative z-10 rounded-full" />
                    ) : (
                      <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-white z-0">
                        <EquinorStar className="w-[120%] h-[120%] absolute -translate-x-[2%]" />
                      </div>
                    )}
                  </button>
                  <div className="flex flex-col justify-center gap-1">
                    <div className="text-[13px] font-bold text-white tracking-wide flex items-center gap-2">
                       Main ID: {currentUser.referralCode}
                       <button onClick={() => {
                          navigator.clipboard.writeText(currentUser.referralCode);
                          alert("ID Copied!");
                       }} className="text-white/60 active:scale-95">
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                       </button>
                    </div>
                    <div className="flex items-center gap-1.5 shadow-lg">
                      <RankBadge rankName={VIP_LEVELS[currentUser.vipLevelIndex || 0].name} size={32} />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal("convidar")}
                  className="bg-[#EC4899] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 text-[9px] font-bold h-[20px]"
                >
                  👥 CONVIDAR
                </button>
              </div>

              {/* Balance Card */}
              <div className="mx-4 mb-3 bg-[#FDD835] rounded-[16px] p-3 flex flex-col justify-between h-[95px] shadow-none">
                <div className="flex flex-col">
                  <div className="text-[12px] font-medium text-[#1A1A1A] leading-none mb-0.5">Account balance</div>
                  <div className="text-[22px] font-bold text-[#1A1A1A] leading-none">₦ {formatCurrency(currentUser.balance)}</div>
                </div>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => setActiveModal("deposit")}
                    className="flex-1 bg-[#1A1A1A] text-[#FFFFFF] h-[28px] rounded-[14px] text-[11px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                  >
                    Recharge
                  </button>
                  <button
                    onClick={() => setActiveModal("withdraw")}
                    className="flex-1 bg-[#1A1A1A] text-[#FFFFFF] h-[28px] rounded-[14px] text-[11px] font-semibold flex items-center justify-center active:scale-95 transition-transform border-none"
                  >
                    Withdraw
                  </button>
                </div>
              </div>

              {/* Promo Card */}
              <div className="mx-4 mb-5 bg-[#4A22D4] rounded-[16px] p-[2px] shadow-[0_0_20px_rgba(74,34,212,0.4)] relative h-[95px]">
                <div className="w-full h-full border border-white/20 rounded-[14px] relative overflow-hidden flex flex-col items-center justify-center flex-1 px-3 py-2 gap-2">
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
                  
                  <div className="text-[16px] font-extrabold text-white leading-tight drop-shadow-md z-10 w-full relative text-center tracking-wide">
                    RESCUE PRESENTS
                  </div>
                  <button
                    className="bg-[#FF4FA3] text-white px-2 h-[26px] rounded-[13px] text-[10px] font-bold uppercase tracking-wider flex items-center justify-center active:scale-95 transition-transform w-[120px] shadow-sm border-none z-10 relative"
                    onClick={() => setActiveModal("redemptionCode")}
                  >
                    Check presents
                  </button>
                  
                  <div className="absolute right-4 bottom-1 w-[40px] h-[40px] flex items-center justify-center rotate-12 z-10 shrink-0 brightness-110 drop-shadow-xl">
                    <Gift className="w-[30px] h-[30px] text-[#FF4FA3]" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Menu Container */}
              <div className="mx-4 mb-5 bg-white rounded-2xl overflow-hidden shadow-lg">
                {[
                  { icon: FileText, label: "Funding details", action: () => setActiveModal("fundingDetails") },
                  { icon: ClipboardList, label: "Commission Record", action: () => setActiveModal("commissionRecord") },
                  { icon: BarChart2, label: "Income Record", action: () => setActiveModal("incomeRecord") },
                  { icon: Landmark, label: "Bank account", action: () => {
                    setBankAccountNumber(currentUser.bankDetails?.accountNumber || "");
                    setSelectedBankCode(currentUser.bankDetails?.bankCode || "");
                    setBankAccountName(currentUser.bankDetails?.accountName || "");
                    setIsEditingBank(false);
                    setActiveModal("bankDetails");
                  } },
                  { icon: Info, label: "About us", action: () => setActiveModal("about") },
                  { icon: Settings, label: "Set Up", action: () => setActiveModal("setup") },
                  { icon: Download, label: "Download", action: () => handleDownloadApp() },
                ].map((item, index, arr) => {
                  const badgeCount = item.label === "Customer Support" 
                    ? chatMessages.filter(m => currentUser?.role === 'admin' 
                        ? !m.receiverId && m.senderId !== currentUser?.id 
                        : m.receiverId === currentUser?.id).length 
                    : 0;

                  return (
                  <div
                    key={index}
                    onClick={item.action}
                    className={`flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-black text-[15px] ${
                      index !== arr.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-gray-500 opacity-80" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.label === "Customer Support" && badgeCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                          {badgeCount}
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                )})}
                <div
                  onClick={logout}
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors text-red-500 font-bold border-t border-gray-100 text-[15px]"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 text-red-400 opacity-80" />
                    <span>Log Out</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "admin" && currentUser?.role === "admin" && (
            <div className="pb-6 relative z-10 w-full max-w-md mx-auto">
              <div className="text-center py-3 pb-2 text-xl font-bold text-white tracking-widest flex items-center justify-center gap-2">
                ADMINISTRATION
              </div>
              
              <div className="mx-4 mb-5 flex p-1 bg-white/10 backdrop-blur-md rounded-xl">
                {(["general", "top", "transactions"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setAdminSubTab(tab)}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${adminSubTab === tab ? "bg-white text-[#7B2FFF] shadow-md" : "text-white/70 hover:text-white hover:bg-white/5"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {adminSubTab === "general" && (
                <>
                  <div className="mx-4 mb-4 flex flex-col gap-3">
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="w-full bg-[#334155] text-white font-bold py-3 rounded-xl shadow-lg border border-white/10 hover:bg-[#475569] active:scale-95 transition-all text-sm tracking-wide relative flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  View Support Chats
                  {chatMessages.filter(m => m.receiverId === currentUser?.id || (!m.receiverId && m.senderId !== currentUser?.id)).length > 0 && (
                    <span className="absolute right-4 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                      {chatMessages.filter(m => !m.receiverId && m.senderId !== currentUser?.id).length}
                    </span>
                  )}
                </button>

                <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors relative overflow-hidden group">
                  <input 
                    type="file" 
                    title="Upload About Us Image" 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    accept="image/*" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const url = await processImageUpload(file);
                          setAboutUsImage(url);
                        } catch (error) {
                          console.error("Failed to upload about us image", error);
                        }
                      }
                    }}
                  />
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <ArrowUpCircle className="w-5 h-5 text-[#7B2FFF]" />
                  </div>
                  <span className="text-white/90 text-xs font-bold tracking-wide uppercase">Admin: Upload About Us Image</span>
                  <span className="text-white/50 text-[10px] mt-1 text-center">Click or drag image to update About Us</span>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                  <h3 className="text-white text-sm font-bold uppercase mb-2">Set Platform Announcement</h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter announcement text... (leave empty to clear)"
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#7B2FFF]"
                      value={announcement || ""}
                      onChange={(e) => setAnnouncement(e.target.value || null)}
                    />
                    <button 
                      onClick={() => alert('Announcement saved')}
                      className="bg-[#7B2FFF] text-white px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setNewProductName("");
                    setNewProductTitle("EQUINOR");
                    setNewProductRoi("");
                    setNewProductMin("");
                    setNewProductDays("30");
                    setNewProductTPlusDays("1");
                    setNewProductQuota("0");
                    setNewProductType("general");
                    setNewProductImageUrl("");
                    setNewProductPromoUnlock("");
                    setActiveModal("addProduct");
                  }}
                  className="w-full bg-gradient-to-r from-[#00D4FF] to-[#7B2FF7] text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all text-sm tracking-wide"
                >
                  + Add Investment Product
                </button>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shrink-0 mt-2">
                  <div className="p-4 border-b border-white/10 text-sm font-bold text-white tracking-wide uppercase">
                    USDT Deposit Settings
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    <span className="text-white/70 text-xs">Provide the USDT address for user deposits. If set, users will be able to deposit via USDT.</span>
                    <input 
                      type="text" 
                      placeholder="e.g. T..." 
                      value={adminUsdtAddress || ''} 
                      onChange={(e) => setAdminUsdtAddress(e.target.value)}
                      className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shrink-0 mt-2">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center text-sm">
                    <h3 className="text-white font-bold uppercase tracking-wider">Deposit Accounts (NGN)</h3>
                    <button 
                      onClick={() => setActiveModal("addDepositAccount")}
                      className="bg-[#7B2FF7] text-white px-3 py-1 rounded text-xs font-bold active:scale-95 transition-transform"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide">
                    {systemDepositAccounts.length === 0 ? (
                      <div className="text-center text-white/50 text-xs py-4">No deposit accounts found.</div>
                    ) : (
                      systemDepositAccounts.map(account => (
                        <div key={account.id} className="flex flex-col bg-white/5 p-3 rounded-xl border border-white/5 gap-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-white font-bold text-sm tracking-wide">{account.bankName}</div>
                              <div className="text-white/80 text-xs mt-0.5">{account.accountName}</div>
                              <div className="text-[#00D4FF] text-xs font-mono font-bold mt-1">{account.accountNumber}</div>
                            </div>
                            <button
                              onClick={() => {
                                if (window.confirm("Delete this deposit account?")) {
                                  deleteSystemDepositAccount(account.id);
                                }
                              }}
                              className="bg-red-500/20 text-red-400 p-1.5 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shrink-0 mt-2">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center text-sm">
                    <h3 className="text-white font-bold uppercase tracking-wider">Manage Products</h3>
                  </div>
                  <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide">
                    {products.filter(p => p.type !== 'redemption_code').map(p => (
                      <div key={p.id} className="flex flex-col bg-white/5 p-3 rounded-xl border border-white/5 gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-white font-bold text-sm">{p.name}</div>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-[10px] bg-[#00D4FF]/20 text-[#00D4FF] px-2 py-0.5 rounded uppercase font-bold">{p.type}</span>
                              <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded font-bold">{p.roi}% ROI</span>
                              <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded font-bold">₦{p.min}</span>
                              <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded font-bold">{p.days}d</span>
                              <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-bold">T+{p.tPlusDays || 1}</span>
                              {p.maxQuota ? <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-bold">Quota: {p.maxQuota}</span> : null}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setNewProductName(p.name);
                              setNewProductTitle(p.title || "EQUINOR");
                              setNewProductRoi(p.roi.toString());
                              setNewProductMin(p.min.toString());
                              setNewProductDays(p.days.toString());
                              setNewProductTPlusDays(p.tPlusDays?.toString() || "1");
                              setNewProductQuota(p.maxQuota?.toString() || "0");
                              setNewProductType(p.type as any);
                              setNewProductImageUrl(p.imageUrl || "");
                              setNewProductPromoUnlock(p.promotionalUnlockDate || "");
                              setActiveModal("editProduct");
                            }}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-1.5 rounded-lg text-xs font-bold transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              deleteProduct(p.id);
                            }}
                            className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 py-1.5 rounded-lg text-xs font-bold transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mx-4 mb-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shrink-0">
                <div className="p-4 border-b border-white/10 flex justify-between items-center text-sm">
                  <h3 className="text-white font-bold uppercase tracking-wider">Contact Links</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-white/70 text-xs font-bold mb-1 block">Manager Link (WhatsApp/Telegram)</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm"
                      value={managerLink}
                      onChange={(e) => updateContactLinks(e.target.value, groupLink)}
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-xs font-bold mb-1 block">Group Link</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm"
                      value={groupLink}
                      onChange={(e) => updateContactLinks(managerLink, e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mx-4 mb-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shrink-0">
                <div className="p-4 border-b border-white/10 flex justify-between items-center text-sm">
                  <h3 className="text-white font-bold uppercase tracking-wider">Manage Users</h3>
                </div>
                <div className="p-4 border-b border-white/10">
                  <input
                    type="text"
                    placeholder="Search by ID, Phone, or Name..."
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    value={userSearchQuery}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#7B2FFF]"
                  />
                </div>
                <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide">
                  {users.filter(u => {
                    if (u.role === "admin") return false;
                    const q = userSearchQuery.toLowerCase();
                    return u.id.toLowerCase().includes(q) || 
                           (u.referralCode && u.referralCode.toLowerCase().includes(q)) ||
                           (u.phone && u.phone.toLowerCase().includes(q)) ||
                           (u.email && u.email.toLowerCase().includes(q)) ||
                           (u.name && u.name.toLowerCase().includes(q));
                  }).map(u => (
                    <div key={u.id} className="flex flex-col bg-white/5 p-3 rounded-xl border border-white/5 gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-white font-bold text-sm">{u.name || (u.phone ? `User ${u.phone.slice(-4)}` : "Unknown")}</div>
                          <div className="text-white/60 text-xs mt-0.5 font-mono">{u.id} {u.phone && `| ${u.phone}`}</div>
                          <div className="flex flex-wrap gap-2 mt-2 border-b border-white/5 pb-2">
                            <span className="text-[10px] bg-[#7B2FF7]/20 text-[#D8B4FE] px-2 py-0.5 rounded font-bold">Balance: {formatCurrency(u.balance || 0)}</span>
                            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold">Deposits: {formatCurrency(transactions.filter(t => t.userId === u.id && t.type === 'deposit' && t.status === 'approved').reduce((sum, tx) => sum + tx.amount, 0))}</span>
                            <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded font-bold">Withdrawn: {formatCurrency(transactions.filter(t => t.userId === u.id && t.type === 'withdrawal' && t.status === 'approved').reduce((sum, tx) => sum + tx.amount, 0))}</span>
                            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold">Referrals: {users.filter(x => x.referredBy === u.referralCode).length}</span>
                            <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded font-bold">Products: {investments.filter(x => x.userId === u.id && x.status === 'active').length}</span>
                            <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-bold">Expired: {investments.filter(x => x.userId === u.id && x.status === 'completed').length}</span>
                            <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded font-bold">VIP {u.vipLevelIndex || 0}</span>
                            <span className={`text-[10px] ${u.disabled ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'} px-2 py-0.5 rounded font-bold uppercase`}>
                              {u.disabled ? 'Disabled' : 'Active'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => {
                            const newPass = window.prompt(`Enter new password for ${u.name || u.phone} (leave empty to clear):`);
                            if (newPass !== null) {
                              adminResetUserPassword(u.id, newPass);
                              alert("Password reset successfully.");
                            }
                          }}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white py-1.5 rounded-lg text-xs font-bold transition-colors"
                        >
                          Reset Password
                        </button>
                        <button
                          onClick={() => {
                                if (u.disabled) {
                                   enableUser(u.id);
                                } else {
                                   disableUser(u.id);
                                }
                          }}
                          className={`flex-1 ${u.disabled ? 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400' : 'bg-red-500/20 hover:bg-red-500/40 text-red-400'} py-1.5 rounded-lg text-xs font-bold transition-colors`}
                        >
                          {u.disabled ? 'Enable User' : 'Disable User'}
                        </button>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => {
                                if (u.withdrawalRestricted) {
                                   restrictUserWithdrawals(u.id, false);
                                } else {
                                   restrictUserWithdrawals(u.id, true);
                                }
                          }}
                          className={`flex-1 ${u.withdrawalRestricted ? 'bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-400' : 'bg-orange-500/20 hover:bg-orange-500/40 text-orange-400'} py-1.5 rounded-lg text-[10px] font-bold transition-colors uppercase`}
                        >
                          {u.withdrawalRestricted ? 'Allow Wthd' : 'Restrict Wthd'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mx-4 mb-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shrink-0">
                <div className="p-4 border-b border-white/10 flex justify-between items-center text-sm">
                  <h3 className="text-white font-bold uppercase tracking-wider">Redemption Codes</h3>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <input 
                      type="number" 
                      placeholder="Amount (₦)" 
                      value={newRedemptionAmount}
                      onChange={(e) => setNewRedemptionAmount(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#00D4FF]"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="Min claims" 
                        value={newRedemptionMin}
                        onChange={(e) => setNewRedemptionMin(e.target.value)}
                        className="w-1/2 bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#00D4FF] min-w-0"
                      />
                      <input 
                        type="number" 
                        placeholder="Max claims" 
                        value={newRedemptionMax}
                        onChange={(e) => setNewRedemptionMax(e.target.value)}
                        className="w-1/2 bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#00D4FF] min-w-0"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="Validity (minutes)" 
                        value={newRedemptionValidity}
                        onChange={(e) => setNewRedemptionValidity(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#00D4FF] min-w-0"
                      />
                      <button 
                        onClick={() => {
                          const amt = Number(newRedemptionAmount);
                          const min = Number(newRedemptionMin);
                          const max = Number(newRedemptionMax);
                          const valid = Number(newRedemptionValidity);
                          if (amt > 0 && min > 0 && max >= min && valid > 0) {
                            // Generate 6 character alphanumeric code
                            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                            let code = '';
                            for (let i = 0; i < 6; i++) {
                              code += chars.charAt(Math.floor(Math.random() * chars.length));
                            }
                            addProduct({
                              name: code,
                              title: '[]',
                              type: 'redemption_code',
                              roi: Date.now(), // Store createdAt in roi
                              min: amt, // Store amount in min
                              days: min, // Store minClaims in days
                              tPlusDays: valid, // validityMinutes
                              maxQuota: max
                            });
                            setNewRedemptionAmount("");
                            alert(`Code generated: ${code}`);
                          } else {
                            alert("Please enter valid amounts (Max >= Min > 0, Validity > 0)");
                          }
                        }}
                        className="shrink-0 bg-gradient-to-r from-[#7B2FF7] to-[#00D4FF] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                  {validRedemptionCodes.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <div className="text-xs text-white/50 font-bold uppercase">Active Codes:</div>
                      {validRedemptionCodes.map(c => {
                        const isExpired = Date.now() > c.createdAt + (c.validityMinutes * 60 * 1000);
                        const isMaxedOut = c.claimedBy.length >= c.maxClaims;
                        return (
                          <div key={c.code} className={`flex flex-col bg-white/5 p-2 rounded-lg text-sm border border-white/5 ${isExpired || isMaxedOut ? 'opacity-50' : ''}`}>
                            <div className="flex justify-between items-center mb-1">
                              <code className="text-[#00D4FF] font-bold tracking-widest">{c.code}</code>
                              <span className="text-white font-medium">₦ {c.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-white/60">
                              <span>Claims: {c.claimedBy.length}/{c.maxClaims} {c.minClaims > 1 ? `(Min: ${c.minClaims})` : ''}</span>
                              <span>{c.validityMinutes}m {isExpired ? '(Expired)' : ''}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="mx-4 mb-5 space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-white/80 font-bold uppercase text-sm tracking-wider">Pending Requests</h3>
                  <button 
                    onClick={() => window.dispatchEvent(new Event('storage')) || window.location.reload()} 
                    className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/30 hover:bg-indigo-500/40 active:scale-95 transition-all"
                  >
                    REFRESH
                  </button>
                </div>
                {transactions.filter(t => t.status === "pending").length === 0 && (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center text-white/50 border border-white/10">
                    No pending transactions to review.
                  </div>
                )}
                
                {transactions.filter(t => t.status === "pending").map((tx, idx) => (
                  <div key={tx.id || idx} className="bg-white rounded-2xl p-4 shadow-lg flex flex-col gap-3">
                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                      <div className={`font-bold uppercase tracking-wider ${tx.type === "deposit" ? "text-[#00D4FF]" : "text-[#F472B6]"}`}>
                        {tx.type} Request
                      </div>
                      <div className="text-slate-400 text-xs">
                        {new Date(tx.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-black">
                      <div className="text-2xl font-bold">{formatCurrency(tx.amount)}</div>
                      <div className="text-sm text-slate-500">
                        Main ID: <span className="font-bold text-[#7B2FF7]">{users.find(u => u.id === tx.userId)?.referralCode || 'N/A'}</span>
                        <span className="mx-2">|</span>
                        Phone: <span className="font-bold text-slate-700">{users.find(u => u.id === tx.userId)?.phone || 'N/A'}</span>
                      </div>
                      {tx.type === "withdrawal" && (
                        <div className="mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <div className="text-xs text-slate-400 font-bold uppercase mb-1 flex justify-between items-center">
                            <span>Bank Info</span>
                          </div>
                          <div className="text-sm font-semibold">{tx.bankDetails?.bankName || users.find(u => u.id === tx.userId)?.bankDetails?.bankName || 'N/A'}</div>
                          <div className="flex justify-between items-center mt-1">
                            <div className="text-sm font-bold text-slate-800">{tx.bankDetails?.accountName || users.find(u => u.id === tx.userId)?.bankDetails?.accountName || 'No Name Provided'}</div>
                            <div className="text-xs text-[#7B2FF7] font-bold">ID: {users.find(u => u.id === tx.userId)?.referralCode || 'N/A'}</div>
                          </div>
                          <div className="text-sm font-mono tracking-widest flex items-center justify-between mt-1 bg-slate-200/50 p-2 rounded-lg">
                            <span>{tx.bankDetails?.accountNumber || users.find(u => u.id === tx.userId)?.bankDetails?.accountNumber || 'N/A'}</span>
                            <button 
                              onClick={() => {
                                const accNum = tx.bankDetails?.accountNumber || users.find(u => u.id === tx.userId)?.bankDetails?.accountNumber;
                                if (accNum) {
                                  navigator.clipboard.writeText(accNum);
                                  addNotification("Copied", "Account number copied to clipboard", "success");
                                }
                              }}
                              className="text-blue-600 hover:text-blue-700 p-1.5 bg-blue-100 rounded-md active:scale-95 transition-all"
                              title="Copy Account Number"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            </button>
                          </div>
                        </div>
                      )}
                      {tx.type === "deposit" && tx.bankDetails?.reference && (
                        <div className="mt-2 bg-blue-50 p-3 rounded-xl border border-blue-100">
                          <div className="text-xs text-blue-400 font-bold uppercase mb-1">Payment Reference</div>
                          <div className="text-sm font-semibold text-blue-900">{tx.bankDetails.reference}</div>
                        </div>
                      )}
                      
                      {/* Admin Info (Tags & Notes) */}
                      <div className="mt-2 text-sm bg-slate-100 p-3 rounded-xl border border-slate-200">
                        {editingTxId === tx.id ? (
                          <div className="flex flex-col gap-2">
                             <div>
                               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tags (comma separated)</label>
                               <input type="text" value={editingTxTags} onChange={(e) => setEditingTxTags(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg p-2 focus:border-[#7B2FFF] outline-none text-slate-800" placeholder="e.g. High Priority, Flagged" />
                             </div>
                             <div>
                               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Internal Notes</label>
                               <textarea value={editingTxNotes} onChange={(e) => setEditingTxNotes(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg p-2 focus:border-[#7B2FFF] outline-none min-h-[60px] text-slate-800" placeholder="Add context..."></textarea>
                             </div>
                             <div className="flex gap-2 justify-end mt-1">
                               <button onClick={() => setEditingTxId(null)} className="px-3 py-1.5 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded-lg font-bold text-xs transition-colors">Cancel</button>
                               <button onClick={() => {
                                  const tags = editingTxTags.split(",").map(t => t.trim()).filter(Boolean);
                                  updateTransactionAdminInfo(tx.id, editingTxNotes, tags);
                                  setEditingTxId(null);
                               }} className="px-4 py-1.5 bg-[#7B2FFF] hover:opacity-90 text-white rounded-lg font-bold text-xs transition-colors shadow">Save</button>
                             </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1.5 cursor-pointer relative group" onClick={() => {
                                setEditingTxId(tx.id);
                                setEditingTxNotes(tx.internalNotes || "");
                                setEditingTxTags((tx.adminTags || []).join(", "));
                          }}>
                             <div className="absolute top-0 right-0 p-0.5 text-slate-300 group-hover:text-[#7B2FFF] transition-colors"><Settings className="w-4 h-4"/></div>
                             {(!tx.adminTags?.length && !tx.internalNotes) && (
                                <div className="text-slate-400 italic text-xs">+ Add admin notes or tags ...</div>
                             )}
                             {(tx.adminTags && tx.adminTags.length > 0) && (
                               <div className="flex flex-wrap gap-1 pr-6">
                                 {tx.adminTags.map((tag, i) => <span key={i} className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">{tag}</span>)}
                               </div>
                             )}
                             {tx.internalNotes && (
                               <div className="text-slate-600 text-xs font-medium pr-6 mt-1 line-clamp-3"><span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Note:</span> {tx.internalNotes}</div>
                             )}
                          </div>
                        )}
                      </div>

                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        onClick={() => approveTransaction(tx.id)}
                        className="flex-1 min-w-[100px] bg-emerald-500 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-transform text-sm"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => rejectTransaction(tx.id)}
                        className="flex-1 min-w-[100px] bg-red-500 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-transform text-sm"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                      <button
                        onClick={() => {
                             rejectTransaction(tx.id);
                             disableUser(tx.userId);
                        }}
                        className="w-full bg-[#1C0F3F] text-red-400 font-bold py-2 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-transform border border-red-500/30 text-sm"
                      >
                        <X className="w-4 h-4" /> Disable User
                      </button>
                    </div>
                  </div>
                ))}

                {transactions.filter(t => t.status !== "pending").length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-slate-200 font-bold text-sm mb-3 uppercase tracking-wider pl-1">Recent History</h3>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden text-white/80 shrink-0">
                      {transactions.filter(t => t.status !== "pending").slice(0, 10).map((tx, idx) => (
                        <div key={tx.id || idx} className="p-4 border-b border-white/5 last:border-b-0 flex flex-col gap-2 text-sm">
                          <div className="flex justify-between items-start text-sm">
                            <div>
                              <div className="font-bold flex items-center gap-1">
                                {tx.type === 'deposit' ? <ArrowDownCircle className="w-4 h-4 text-[#00D4FF]" /> : <ArrowUpCircle className="w-4 h-4 text-[#F472B6]" />}
                                <span className="capitalize">{tx.type}</span>
                              </div>
                              <div className="text-xs text-white/50">{new Date(tx.date).toLocaleDateString()}</div>
                              <div className="text-[10px] text-white/40 font-mono mt-0.5">
                                Main ID: <span className="text-[#D8B4FE] font-bold">{users.find(u => u.id === tx.userId)?.referralCode || 'N/A'}</span>
                                <span className="mx-1">|</span>
                                Phone: <span className="text-white/80">{users.find(u => u.id === tx.userId)?.phone || 'N/A'}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0 ml-4">
                              <div className="font-medium text-[15px]">{formatCurrency(tx.amount)}</div>
                              <div className={`text-xs font-bold ${tx.status === "approved" ? "text-emerald-400" : "text-red-400"}`}>
                                {tx.status}
                              </div>
                            </div>
                          </div>
                          {tx.type === "withdrawal" && (
                            <div className="bg-white/5 p-2 rounded-lg text-xs flex flex-col gap-0.5 mt-1 border border-white/5">
                               <div className="font-semibold text-white/80">{tx.bankDetails?.bankName || users.find(u => u.id === tx.userId)?.bankDetails?.bankName || 'N/A'}</div>
                               <div className="flex justify-between items-center w-full mt-0.5">
                                 <div className="font-bold text-white/90">{tx.bankDetails?.accountName || users.find(u => u.id === tx.userId)?.bankDetails?.accountName || 'No Name Provided'}</div>
                                 <div className="text-[10px] text-[#00D4FF] font-bold tracking-wider">ID: {users.find(u => u.id === tx.userId)?.referralCode || 'N/A'}</div>
                               </div>
                               <div className="font-mono text-[10px] text-emerald-300 mt-1 tracking-wider bg-black/20 py-1 px-1.5 rounded">{tx.bankDetails?.accountNumber || users.find(u => u.id === tx.userId)?.bankDetails?.accountNumber || 'N/A'}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
                </>
              )}

              {adminSubTab === "top" && (
                <div className="mx-4 mb-5 space-y-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shrink-0">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center text-sm">
                      <h3 className="text-white font-bold uppercase tracking-wider">Top by Deposits</h3>
                    </div>
                    <div className="p-2 space-y-2 max-h-[400px] overflow-y-auto">
                       {[...users]
                         .sort((a, b) => {
                            const aDep = transactions.filter(t => t.userId === a.id && t.type === "deposit" && t.status === "approved").reduce((sum, tx) => sum + tx.amount, 0);
                            const bDep = transactions.filter(t => t.userId === b.id && t.type === "deposit" && t.status === "approved").reduce((sum, tx) => sum + tx.amount, 0);
                            return bDep - aDep;
                         })
                         .slice(0, 50)
                         .map((u, i) => {
                            const dep = transactions.filter(t => t.userId === u.id && t.type === "deposit" && t.status === "approved").reduce((sum, tx) => sum + tx.amount, 0);
                            if (dep === 0) return null;
                            return (
                              <div key={u.id} className="flex flex-col bg-white/5 p-3 rounded-xl border border-white/5 gap-2">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2 text-white">
                                    <span className="font-bold text-[#00D4FF] w-6">#{i+1}</span>
                                    <div>
                                      <div className="font-bold text-sm">{u.name || (u.phone ? `User ${u.phone.slice(-4)}` : "Unknown")}</div>
                                      <div className="text-[10px] text-white/50">{u.id} {u.phone ? `| ${u.phone}` : ''}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-[#34C759] font-bold text-sm tracking-tight">{formatCurrency(dep)}</div>
                                  </div>
                                </div>
                              </div>
                            );
                       })}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shrink-0 mt-4">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center text-sm">
                      <h3 className="text-white font-bold uppercase tracking-wider">Top by Referrals</h3>
                    </div>
                    <div className="p-2 space-y-2 max-h-[400px] overflow-y-auto">
                       {[...users]
                         .sort((a, b) => {
                            const aRef = users.filter(x => x.referredBy === a.referralCode).length;
                            const bRef = users.filter(x => x.referredBy === b.referralCode).length;
                            return bRef - aRef;
                         })
                         .slice(0, 50)
                         .map((u, i) => {
                            const refCount = users.filter(x => x.referredBy === u.referralCode).length;
                            if (refCount === 0) return null;
                            return (
                              <div key={u.id} className="flex flex-col bg-white/5 p-3 rounded-xl border border-white/5 gap-2">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2 text-white">
                                    <span className="font-bold text-[#F472B6] w-6">#{i+1}</span>
                                    <div>
                                      <div className="font-bold text-sm">{u.name || (u.phone ? `User ${u.phone.slice(-4)}` : "Unknown")}</div>
                                      <div className="text-[10px] text-white/50">{u.id} {u.phone ? `| ${u.phone}` : ''}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-white font-bold text-sm">{refCount} Referrals</div>
                                  </div>
                                </div>
                              </div>
                            );
                       })}
                    </div>
                  </div>
                </div>
              )}

              {adminSubTab === "transactions" && (
                <div className="mx-4 mb-5 space-y-4">
                  <div className="flex justify-center gap-2 bg-white/10 p-1 rounded-lg backdrop-blur-sm mx-auto max-w-fit">
                     <button onClick={() => setTxPeriod("all")} className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase ${txPeriod === "all" ? "bg-[#7B2FFF] text-white" : "text-white/60 hover:text-white"}`}>All Time</button>
                     <button onClick={() => setTxPeriod("weekly")} className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase ${txPeriod === "weekly" ? "bg-[#7B2FFF] text-white" : "text-white/60 hover:text-white"}`}>Weekly</button>
                     <button onClick={() => setTxPeriod("monthly")} className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase ${txPeriod === "monthly" ? "bg-[#7B2FFF] text-white" : "text-white/60 hover:text-white"}`}>Monthly</button>
                  </div>
                  
                  {(() => {
                     const now = new Date();
                     let filteredTx = transactions.filter(t => t.status === "approved");
                     if (txPeriod === "weekly") {
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        filteredTx = filteredTx.filter(t => new Date(t.date) >= weekAgo);
                     } else if (txPeriod === "monthly") {
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        filteredTx = filteredTx.filter(t => new Date(t.date) >= monthAgo);
                     }

                     const totalDep = filteredTx.filter(t => t.type === "deposit").reduce((s,t) => s+t.amount, 0);
                     const totalWith = filteredTx.filter(t => t.type === "withdrawal").reduce((s,t) => s+t.amount, 0);

                     return (
                       <>
                         <div className="flex gap-3">
                           <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg relative overflow-hidden flex flex-col justify-between">
                             <div className="absolute top-0 right-0 p-2 opacity-20"><ArrowDownCircle className="w-8 h-8 text-[#00D4FF]" /></div>
                             <div className="text-[10px] text-[#00D4FF] font-bold uppercase mb-1 z-10 w-full line-clamp-1">Deposits</div>
                             <div className="text-white font-bold text-base sm:text-lg tracking-tight z-10">{formatCurrency(totalDep)}</div>
                           </div>
                           <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg relative overflow-hidden flex flex-col justify-between">
                             <div className="absolute top-0 right-0 p-2 opacity-20"><ArrowUpCircle className="w-8 h-8 text-[#F472B6]" /></div>
                             <div className="text-[10px] text-[#F472B6] font-bold uppercase mb-1 z-10 w-full line-clamp-1">Withdrawals</div>
                             <div className="text-white font-bold text-base sm:text-lg tracking-tight z-10">{formatCurrency(totalWith)}</div>
                           </div>
                         </div>
                         
                         <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden text-white/80 shrink-0">
                           <div className="p-3 border-b border-white/10 font-bold text-xs uppercase tracking-wider text-white">Verified Records</div>
                           <div className="max-h-[400px] overflow-y-auto">
                              {filteredTx.length === 0 ? (
                                <div className="p-4 text-center text-white/50 text-xs">No records found.</div>
                              ) : (
                                filteredTx.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 100).map(tx => (
                                  <div key={tx.id} className="p-3 border-b border-white/5 flex justify-between items-center text-sm hover:bg-white/5 transition-colors">
                                    <div>
                                      <div className={`font-bold capitalize flex gap-1 items-center ${tx.type === 'deposit' ? 'text-[#00D4FF]' : 'text-[#F472B6]'}`}>
                                        {tx.type} 
                                      </div>
                                      <div className="text-white/40 text-[10px]">{new Date(tx.date).toLocaleString()}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-bold text-white text-[15px]">{formatCurrency(tx.amount)}</div>
                                      <div className="text-[10px] text-[#D8B4FE] font-mono tracking-wider">{users.find(u => u.id === tx.userId)?.phone || 'Unknown'}</div>
                                    </div>
                                  </div>
                                ))
                              )}
                           </div>
                         </div>
                       </>
                     )
                  })()}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Ambient Glows in Background */}
        <div className="absolute top-[-5%] left-[-10%] w-64 h-64 bg-[#7B2FF7] rounded-full mix-blend-screen filter blur-[80px] opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-[-20%] w-80 h-80 bg-[#00D4FF] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>

        {/* Bottom Tab Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[64px] bg-white border-t border-[#F0F0F0] flex justify-around items-center px-4 pb-safe z-30">
          <div className="flex w-full max-w-md mx-auto justify-around items-center h-full relative">
            <TabItem
              onClick={() => {
                setActiveTab("home");
                setActiveModal(null);
              }}
              icon={<Home className="w-[24px] h-[24px]" style={{ strokeWidth: 2 }} />}
              label="Home"
              active={activeTab === "home" && !activeModal}
            />
            {/* Middle Big Logo for Products */}
            <div className="relative -top-5 flex flex-col items-center z-40 mx-2">
              <button 
                onClick={() => {
                  setActiveTab("product");
                  setActiveModal(null);
                }}
                className={`w-[56px] h-[56px] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(123,47,255,0.4)] transition-transform active:scale-95 border-[3px] border-white ${activeTab === "product" && !activeModal ? "bg-[#7B2FF7]" : "bg-[#1C0F3F]"}`}
              >
                <EquinorStar className="w-[36px] h-[36px]" />
              </button>
            </div>
            <TabItem
              onClick={() => {
                setActiveTab("order");
                setActiveModal(null);
              }}
              icon={<ListOrdered className="w-[24px] h-[24px]" style={{ strokeWidth: 2 }} />}
              label="Order"
              active={activeTab === "order" && !activeModal}
            />
            {currentUser?.role === "admin" && (
              <TabItem
                onClick={() => {
                  setActiveTab("admin");
                  setActiveModal(null);
                }}
                icon={<ShieldCheck className="w-[24px] h-[24px]" style={{ strokeWidth: 2 }} />}
                label="Admin"
                badge={transactions.filter(t => t.status === "pending").length}
                active={activeTab === "admin" && !activeModal}
              />
            )}
            <TabItem
              onClick={() => {
                setActiveTab("mine");
                setActiveModal(null);
              }}
              icon={<User className="w-[24px] h-[24px]" style={{ strokeWidth: 2 }} />}
              label="My"
              active={activeTab === "mine" && !activeModal}
            />
          </div>
        </div>

        {activeModal === "visualNotification" && (
          <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-200" onClick={() => setActiveModal(null)}>
            <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
              <img 
                src={
                  notificationData.type === 'purchase_success' ? imgPurchaseSuccess :
                  notificationData.type === 'reward_unlocked' ? imgRewardUnlocked :
                  notificationData.type === 'you_won' ? imgYouWon :
                  notificationData.type === 'try_again' ? imgTryAgain :
                  imgInsufficientBalance
                } 
                className="w-full h-full object-cover select-none pointer-events-none absolute inset-0" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#B20F24]/80 via-transparent to-black/30 pointer-events-none" />
              
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 bg-black/40 hover:bg-[#B20F24] text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur transition-colors"
                style={{ zIndex: 10 }}
              >
                ✕
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 w-full shadow-lg">
                  <h3 className="text-white font-bold text-[22px] tracking-wide mb-1 drop-shadow-md">
                    {notificationData.title}
                  </h3>
                  <p className="text-white/90 text-[14px] font-medium leading-snug drop-shadow-sm">
                    {notificationData.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {activeModal && !["convidar", "levelUp", "about", "setup", "setupPhone", "setupPassword", "setupAlertThreshold", "bankDetails", "prizeDraw", "fundingDetails", "addProduct", "editProduct", "commissionRecord", "incomeRecord", "redemptionCode", "redemptionReward", "withdraw", "deposit", "purchaseSuccess", "contact", "equinorConfirm", "sysAnnouncement", "download", "visualNotification"].includes(activeModal) && (
          <div className="absolute inset-0 z-50 bg-[#0A0E2E]/80 backdrop-blur-md flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom flex flex-col max-h-[80%] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#0A0E2E] capitalize">
                  {activeModal}
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-slate-400 hover:text-[#0A0E2E] p-2"
                >
                  ✕
                </button>
              </div>

              {/* Processing Overlay for main modals */}
              {isProcessing && (
                <div className="absolute inset-0 z-50 bg-[#0A0E2E]/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in rounded-t-3xl border-t border-white/10">
                  <Loader2 className="w-10 h-10 text-[#7B2FF7] animate-spin mb-4" />
                  <span className="text-white font-medium tracking-wider">Processing...</span>
                </div>
              )}

            </div>
          </div>
        )}

        {activeModal === "prizeDraw" && (
          <div className="absolute inset-0 z-[60] flex flex-col bg-gradient-to-b from-[#6A00F4] to-[#0A0A0A] overflow-y-auto pb-safe">
            {/* Header / Back button */}
            <div className="flex items-center justify-center relative h-14 pt-safe shrink-0 px-4 mt-2">
              <button onClick={() => setActiveModal(null)} className="absolute left-4 p-2 text-white active:scale-95 transition-transform z-10 bg-white/10 rounded-full hover:bg-white/20">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="font-sans font-bold text-[20px] text-white uppercase tracking-[1px]">Prize Draw</h1>
            </div>

            <div className="flex flex-col items-center pt-[24px] pb-[32px] px-4">
              <div className="mb-8 bg-[#7B2FFF]/30 border border-[#7B2FFF]/50 px-4 py-2 rounded-full shadow-[0_4px_12px_rgba(123,47,255,0.2)]">
                 <span className="text-white text-sm font-medium">0 Remaining opportunities</span>
              </div>
              
              <div className="grid grid-cols-3 gap-3 w-full max-w-[342px] mx-auto mb-10">
                {Array.from({ length: 12 }).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                       triggerVisualNotification("try_again", "BETTER LUCK NEXT TIME", "Keep engaging with Equinor");
                    }}
                    className="aspect-[100/140] w-full rounded-[16px] bg-gradient-to-b from-[#00D4FF] to-[#7B2FFF] border-[2px] border-[#FFD600] flex flex-col items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-95 transition-transform overflow-hidden relative"
                    style={{ animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                    <Gem className="w-12 h-12 text-[#FF4FB2] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] relative z-10" style={{ strokeWidth: 1.5, fill: "#FF4FB2" }} />
                  </button>
                ))}
              </div>

              {/* List of winners */}
              <div className="w-full max-w-[342px] bg-[#1A1A1A] rounded-[20px] p-4 mb-6 border border-white/5 shadow-xl">
                <h3 className="text-white/80 font-bold text-sm uppercase tracking-wider mb-4 border-b border-white/5 pb-3">Recent Winners</h3>
                <div 
                  className="relative h-[200px] overflow-hidden"
                  style={{
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
                  }}
                >
                  <div className="flex flex-col animate-scroll-winners hover:[animation-play-state:paused] active:[animation-play-state:paused]">
                    {[0, 1].map((group) => (
                      <div key={group} className="flex flex-col gap-3 pb-3">
                        {[
                          { id: '811****7X', amount: '300' },
                          { id: '902****2A', amount: '5000' },
                          { id: '708****1M', amount: '800' },
                          { id: '815****4K', amount: '500' },
                          { id: '906****9Y', amount: '2000' },
                          { id: '803****5B', amount: '1500' },
                          { id: '704****8W', amount: '250' },
                          { id: '810****2L', amount: '4500' },
                          { id: '905****6P', amount: '1200' },
                          { id: '701****3R', amount: '6000' },
                          { id: '807****8T', amount: '150' },
                          { id: '912****4H', amount: '850' },
                          { id: '702****9J', amount: '1000' },
                          { id: '816****3C', amount: '750' },
                          { id: '903****1F', amount: '2200' },
                          { id: '709****6E', amount: '400' },
                          { id: '804****5Z', amount: '5500' },
                          { id: '911****8M', amount: '350' },
                          { id: '705****2Q', amount: '1800' },
                          { id: '813****7D', amount: '650' },
                          { id: '908****4V', amount: '3000' },
                          { id: '703****1N', amount: '900' },
                          { id: '817****9K', amount: '450' },
                          { id: '901****5B', amount: '8000' },
                          { id: '706****8C', amount: '1100' },
                          { id: '802****3X', amount: '550' },
                          { id: '914****7L', amount: '4200' },
                          { id: '710****4G', amount: '300' },
                          { id: '809****2W', amount: '1400' },
                          { id: '907****6R', amount: '2500' },
                          { id: '707****5T', amount: '200' },
                          { id: '812****1Y', amount: '600' },
                          { id: '904****8U', amount: '3200' },
                          { id: '711****9P', amount: '1000' },
                          { id: '805****4S', amount: '700' },
                          { id: '910****3H', amount: '1600' },
                          { id: '712****2A', amount: '2800' },
                          { id: '808****6V', amount: '800' },
                          { id: '915****5D', amount: '1900' },
                          { id: '713****7M', amount: '5000' },
                          { id: '801****1Q', amount: '400' },
                          { id: '913****8E', amount: '1300' },
                          { id: '714****4Z', amount: '2100' },
                          { id: '806****9J', amount: '950' },
                          { id: '916****3F', amount: '3800' },
                          { id: '715****6K', amount: '150' },
                          { id: '814****2B', amount: '1750' },
                          { id: '909****5N', amount: '2600' },
                          { id: '716****8G', amount: '3500' },
                          { id: '818****7W', amount: '450' },
                        ].map((winner, idx) => (
                           <div key={idx} className="flex flex-shrink-0 items-center justify-between bg-[#222222] p-3 rounded-xl border border-white/5">
                              <div className="flex flex-col">
                                 <span className="text-white text-[13px] font-bold tracking-wide">{winner.id}</span>
                                 <span className="text-[#FFD600] text-[10px] font-medium mt-0.5 uppercase tracking-wider">Successful victory</span>
                              </div>
                              <div className="bg-[#7B2FFF]/20 px-3 py-1.5 rounded-lg border border-[#7B2FFF]/30">
                                 <span className="text-[#00D4FF] font-black text-sm">₦{winner.amount}</span>
                              </div>
                           </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rule explaination */}
              <div className="w-full max-w-[342px] bg-[#1A1A1A] rounded-[20px] p-5 border border-white/5 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD600]/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />
                <h3 className="text-white/80 font-bold text-sm uppercase tracking-wider mb-4 border-b border-white/5 pb-3 relative z-10">Rule Explanation</h3>
                <ol className="text-[#FFD600] text-[13px] space-y-4 list-decimal pl-4 font-medium relative z-10 leading-relaxed">
                  <li>When a Level A member is invited to participate in a designated project for the first time, the superior person will get the opportunity to open the "Asset Box."</li>
                  <li>Users who invest in any project will also get the opportunity to open the Asset Box.</li>
                </ol>
              </div>

            </div>
            {/* Extra style for staggering fade-in if needed, though Tailwind handles basic things. We'll add a simple inline style keyframes for it. */}
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
              @keyframes scrollWinners {
                from { transform: translateY(0); }
                to { transform: translateY(-50%); }
              }
              .animate-scroll-winners {
                animation: scrollWinners 60s linear infinite;
              }
            `}} />
          </div>
        )}
        {activeModal === "convidar" && (
          <div className="absolute inset-0 z-50 flex flex-col bg-gradient-to-b from-[#2a0845] to-[#641154] overflow-y-auto">
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[#d946ef] rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>
            
            {/* Header */}
            <div className="flex items-center px-4 h-14 relative shrink-0 pt-safe">
              <button onClick={() => setActiveModal(null)} className="absolute left-4 p-2 text-white active:scale-95 transition-transform z-10">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-center text-white text-[17px] font-semibold z-0 tracking-wide">Invite</h2>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center pt-2 pb-8 px-5 relative z-10">
              {/* Invite Card */}
              <div className="w-full max-w-[340px] bg-white rounded-[24px] pt-8 pb-6 px-6 relative shadow-[0_15px_40px_rgba(0,0,0,0.3)] flex flex-col items-center">
                {/* Side cutouts to look like a ticket */}
                <div className="absolute top-[65%] left-[-16px] w-[32px] h-[32px] bg-[#490c4d] rounded-full"></div>
                <div className="absolute top-[65%] right-[-16px] w-[32px] h-[32px] bg-[#490c4d] rounded-full"></div>

                <div className="text-[#0A0E2E] text-[15px] font-bold mb-6 tracking-wide uppercase">Your Invitation Code</div>

                {/* QR Code Placeholder / Space */}
                <div className="w-40 h-40 bg-gray-50 rounded-2xl mb-4 flex items-center justify-center border-[6px] border-gray-100 shadow-sm overflow-hidden">
                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(referralLink)}&margin=10`} alt="QR Code" className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                
                <div className="text-[#0A0E2E] font-black text-[32px] tracking-widest mb-6 w-full text-center">
                  {currentUser?.referralCode}
                </div>

                {/* Dashed divider */}
                <div className="w-full border-t-[2px] border-dashed border-gray-200 absolute top-[65%] mt-[15px] left-0"></div>

                {/* Copy Icon Area */}
                <div className="mt-8 flex flex-col items-center">
                  <button 
                    onClick={() => {
                      if (currentUser?.referralCode) {
                        navigator.clipboard.writeText(currentUser.referralCode);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }
                    }}
                    className="w-12 h-12 bg-gray-50 rounded-full text-[#b529e8] shadow-sm flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all outline outline-1 outline-gray-200"
                  >
                    {copiedCode ? <CheckCheck className="w-6 h-6" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <span className="text-gray-400 text-[11px] font-bold mt-2 uppercase tracking-wider">Copy Code</span>
                </div>
              </div>

              {/* Link Preview Field */}
              <div className="w-full max-w-[340px] mt-8 mb-8 flex items-center bg-white/10 border border-white/20 rounded-full p-1.5 pl-5 backdrop-blur-md">
                <span className="flex-1 text-white/90 text-sm font-medium truncate mr-3">
                  {referralLink}
                </span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(referralLink);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="w-10 h-10 shrink-0 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 active:scale-95 transition-all"
                >
                  {copiedLink ? <CheckCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              {/* Primary Actions */}
              <div className="w-full max-w-[340px] flex flex-col gap-3 mt-auto">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(referralLink);
                    setToastMessage("Link copied to clipboard!");
                    setTimeout(() => setToastMessage(null), 2000);
                  }}
                  className="w-full py-4 bg-[#b529e8] hover:bg-[#c93afc] text-white rounded-full font-bold text-[15px] tracking-wide shadow-[0_8px_24px_rgba(181,41,232,0.4)] active:scale-95 transition-all"
                >
                  Copy link
                </button>
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Join me on Equinor',
                        text: `Use my referral code: ${currentUser?.referralCode}`,
                        url: referralLink
                      }).catch((err) => {
                        console.log('Error sharing', err);
                      });
                    } else {
                      navigator.clipboard.writeText(referralLink);
                      setToastMessage("Shared link copied!");
                      setTimeout(() => setToastMessage(null), 2000);
                    }
                  }}
                  className="w-full py-4 bg-[#63109a] hover:bg-[#7e17c2] text-white rounded-full font-bold text-[15px] tracking-wide shadow-[0_8px_24px_rgba(99,16,154,0.4)] active:scale-95 transition-all"
                >
                  To share
                </button>
                <div className="flex flex-col items-center mt-2 opacity-80 pb-2">
                  <span className="text-white text-[12px] text-center">
                    Earn <span className="font-bold text-[#FFD700]">₦10,000</span> for every new VIP level your invitee unlocks!
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModal === "redemptionCode" && (
          <div className="absolute inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={() => setActiveModal(null)} />
            
            <div className="relative w-[320px] bg-[#E53935] rounded-[16px] shadow-[0_8px_32px_rgba(229,57,53,0.4)] animate-in zoom-in-95 duration-200">
              {/* Decorative elements - floating coins & envelopes */}
              <div className="absolute -top-5 -left-5 z-10 w-12 h-12 bg-gradient-to-br from-[#FFE066] to-[#F59E0B] rounded-full drop-shadow-xl flex items-center justify-center border-2 border-yellow-300">
                <span className="text-xl">💰</span>
              </div>
              <div className="absolute -bottom-3 -right-3 z-10 w-14 h-10 bg-gradient-to-br from-[#EF4444] to-[#B91C1C] rounded-md shadow-lg border border-red-400 rotate-12 flex items-center justify-center">
                <span className="text-white">✉️</span>
              </div>
              <div className="absolute top-1/2 -right-5 z-10 w-8 h-8 bg-gradient-to-br from-[#FFE066] to-[#F59E0B] rounded-full drop-shadow-md border border-yellow-300 flex items-center justify-center">
                <span className="text-sm">🪙</span>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-1 right-1 p-3 text-white/90 hover:text-white transition-colors z-20 active:scale-95"
                aria-label="Close redemption code modal"
              >
                ✕
              </button>

              <div className="pt-8 px-5 pb-5 flex flex-col items-center relative z-10">
                <h2 className="text-[18px] font-semibold text-white mb-6 tracking-wide drop-shadow-sm">Redemption Code</h2>
                
                <div className="w-full mb-6">
                  <input 
                    type="text"
                    value={redemptionCode}
                    onChange={(e) => setRedemptionCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    placeholder="Please enter the redemption code"
                    className="w-full h-12 bg-[#FFF3E0] rounded-full px-5 text-[#212121] placeholder-[#757575] font-medium text-[14px] text-center outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-inner"
                    aria-label="Redemption code input"
                    maxLength={16}
                  />
                </div>

                <button
                  disabled={redemptionCode.length !== 6 || isProcessing}
                  onClick={async () => {
                    setIsProcessing(true);
                    const freshProducts = await refreshProducts() || products;
                    const freshValidCodes = freshProducts.filter(p => p.type === 'redemption_code').map(p => {
                      let claimedBy = [];
                      try { claimedBy = p.title ? JSON.parse(p.title) : []; } catch (e) { }
                      return {
                        code: p.name,
                        amount: p.min,
                        minClaims: p.days,
                        maxClaims: p.maxQuota || 1,
                        validityMinutes: p.tPlusDays || 60,
                        claimedBy,
                        createdAt: p.roi
                      };
                    });
                    
                    const found = freshValidCodes.find(c => c.code === redemptionCode);
                    if (found) {
                      const isExpired = Date.now() > found.createdAt + (found.validityMinutes * 60 * 1000);
                      const isMaxedOut = found.claimedBy.length >= found.maxClaims;
                      const hasClaimed = currentUser ? found.claimedBy.includes(currentUser.id) : false;
                      
                      if (isExpired) {
                        triggerVisualNotification("try_again", "CODE EXPIRED", "This redemption code has expired");
                      } else if (isMaxedOut) {
                        triggerVisualNotification("try_again", "LIMIT REACHED", "Maximum claims limit reached");
                      } else if (hasClaimed) {
                        triggerVisualNotification("try_again", "ALREADY CLAIMED", "You have already claimed this code");
                      } else {
                        setRewardAmount(found.amount);
                        setActiveModal("redemptionReward");
                        playNotificationSound('chime');
                        setShowCongratsEffect(true);
                        setTimeout(() => setShowCongratsEffect(false), 2500);
                        const prodToUpdate = freshProducts.find(p => p.type === 'redemption_code' && p.name === redemptionCode);
                        if (prodToUpdate) {
                          const newClaimedBy = [...found.claimedBy, currentUser?.id || `guest-${Date.now()}`];
                          editProduct(prodToUpdate.id, { title: JSON.stringify(newClaimedBy) });
                        }
                        setRedemptionCode("");
                      }
                    } else {
                      triggerVisualNotification("try_again", "INVALID CODE", "Please check your code and try again");
                    }
                    setIsProcessing(false);
                  }}
                  className={`w-full h-12 rounded-full font-bold text-[16px] transition-all shadow-md flex items-center justify-center ${
                    redemptionCode.length === 6 && !isProcessing
                      ? 'bg-white text-[#E53935] active:scale-95 hover:bg-gray-50' 
                      : 'bg-[#E0E0E0] text-[#757575] cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === "redemptionReward" && (
          <div className="absolute inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={() => !showCongratsEffect && setActiveModal(null)} />
            
            <div className="relative w-full max-w-[340px] bg-gradient-to-b from-[#FF5252] to-[#FF1744] rounded-[20px] shadow-2xl animate-in zoom-in-95 duration-200">
              
              {/* Continuous sparkling lights */}
              <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden rounded-[20px]">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={`steady-sparkle-${i}`}
                    animate={{
                      opacity: [0.2, 1, 0.2],
                      scale: [0.5, 1.2, 0.5],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1 + Math.random() * 2,
                      delay: Math.random() * 2,
                      ease: "easeInOut"
                    }}
                    className="absolute text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    style={{
                      top: `${Math.random() * 90}%`,
                      left: `${Math.random() * 90 + 5}%`,
                      filter: `hue-rotate(${i * 30}deg)`,
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </div>

              <AnimatePresence>
                {showCongratsEffect && (
                  <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-[20px]">
                    {[...Array(25)].map((_, i) => (
                      <motion.div
                        key={`coin-${i}`}
                        initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
                        animate={{ 
                          opacity: [0, 1, 1, 0], 
                          scale: [0.5, 1.2, 1, 0.5], 
                          x: `calc(-50% + ${(Math.random() - 0.5) * 400}px)`, 
                          y: `calc(-50% + ${(Math.random() - 0.5) * 400 - 50}px)`, 
                          rotate: Math.random() * 360 
                        }}
                        transition={{ duration: 1.5, delay: Math.random() * 0.3, ease: "easeOut" }}
                        className="absolute top-1/2 left-1/2 text-3xl drop-shadow-lg"
                      >
                        {Math.random() > 0.5 ? '🪙' : '✨'}
                      </motion.div>
                    ))}
                    {[...Array(25)].map((_, i) => (
                      <motion.div
                        key={`flower-${i}`}
                        initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
                        animate={{ 
                          opacity: [0, 1, 1, 0], 
                          scale: [0.5, 1.5, 1, 0.5], 
                          x: `calc(-50% + ${(Math.random() - 0.5) * 400}px)`, 
                          y: `calc(-50% + ${(Math.random() - 0.5) * 400 - 50}px)`, 
                          rotate: Math.random() * 360 
                        }}
                        transition={{ duration: 1.8, delay: Math.random() * 0.4, ease: "easeOut" }}
                        className="absolute top-1/2 left-1/2 text-3xl drop-shadow-lg"
                      >
                        {Math.random() > 0.3 ? '🌸' : (Math.random() > 0.5 ? '🏵️' : '🌺')}
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>

              {/* Visual Header */}
              <div className="pt-4 pb-2 px-4 flex justify-center relative min-h-[140px]">
                {/* Decorative elements - coins and envelopes */}
                <div className="absolute top-2 left-6 z-20 w-8 h-8 bg-gradient-to-br from-[#FFE066] to-[#F59E0B] rounded-full drop-shadow-md border border-yellow-300 flex items-center justify-center -rotate-12">
                  <span className="text-sm">🪙</span>
                </div>
                <div className="absolute top-8 right-6 z-20 w-10 h-10 bg-gradient-to-br from-[#FFE066] to-[#F59E0B] rounded-full drop-shadow-md border border-yellow-300 flex items-center justify-center rotate-12">
                  <span className="text-xl">💰</span>
                </div>
                <div className="absolute bottom-6 left-2 z-20 w-12 h-8 bg-pink-100 rounded-md shadow-md border border-pink-200 -rotate-12 flex items-center justify-center">
                  <span className="text-xs">✉️</span>
                </div>
                <div className="absolute top-12 left-1/4 z-20 w-10 h-7 bg-pink-100 rounded-md shadow-md border border-pink-200 rotate-12 flex items-center justify-center">
                  <span className="text-[10px]">✉️</span>
                </div>
                
                {/* Treasure Chest */}
                <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="relative z-10 drop-shadow-xl mt-4">
                  {/* Chest Base */}
                  <path d="M10,40 L110,40 L105,90 C105,95.5 100.5,100 95,100 L25,100 C19.5,100 15,95.5 15,90 L10,40 Z" fill="#E91E63" />
                  {/* Chest Lid (Open) */}
                  <path d="M10,40 C10,17.9 32.4,0 60,0 C87.6,0 110,17.9 110,40 L10,40 Z" fill="#D81B60" />
                  {/* Inner darkness */}
                  <path d="M15,40 L105,40 C105,30 85,20 60,20 C35,20 15,30 15,40 Z" fill="#880E4F" />
                  {/* Gold trim bottom */}
                  <path d="M10,95 L110,95 L105,100 L15,100 Z" fill="#FFD700" />
                  {/* Lock/Latch */}
                  <rect x="52" y="32" width="16" height="16" rx="2" fill="#FFC107" />
                  <circle cx="60" cy="40" r="3" fill="#FFF8E1" />
                </svg>
              </div>

              {/* Reward Card Content */}
              <div className="mx-4 mb-4 mt-2 bg-white rounded-t-[16px] rounded-b-[16px] overflow-hidden shadow-lg relative z-20 flex flex-col items-center">
                <div className="w-full flex flex-col items-center pt-5 pb-6 border-b-2 border-dashed border-gray-200">
                  <span className="text-[#616161] text-[14px] font-medium mb-3">Congratulations on winning the prize</span>
                  <span className="text-[#D32F2F] text-[28px] font-bold">₦ {rewardAmount.toFixed(2)}</span>
                </div>
                
                {/* Dashed edge cutouts for realistic ticket look */}
                <div className="absolute left-[-8px] top-[80px] w-4 h-4 bg-[#FF384D] rounded-full"></div>
                <div className="absolute right-[-8px] top-[80px] w-4 h-4 bg-[#FF384D] rounded-full"></div>
              </div>

              <div className="px-4 pb-4 relative z-20">
                <button
                  onClick={() => {
                    addBalance(rewardAmount);
                    triggerVisualNotification("you_won", "CONGRATULATIONS", `You've earned ₦${rewardAmount}`);
                  }}
                  className="w-full h-12 bg-[#FFF3E0] hover:bg-[#FFE0B2] text-[#212121] rounded-full font-semibold text-[16px] transition-all shadow-md active:scale-95 flex items-center justify-center"
                >
                  Receive
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === "levelUp" && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 transition-opacity duration-200" onClick={() => setActiveModal(null)}>
            <div className="bg-white rounded-[20px] w-full max-w-[320px] flex flex-col items-center text-center relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="w-full py-8 px-6 pb-6 flex flex-col items-center">
                <div className="text-5xl mb-3 animate-bounce">🎉</div>
                <h2 className="text-[28px] font-bold text-black mb-4 tracking-[-0.02em]">LEVEL UP</h2>
                
                <p className="text-[#FF3B30] font-bold text-lg mb-2">You're now {currentVipLevel.name}</p>
                {nextVipLevel && (
                  <p className="text-gray-500 text-[14px] leading-snug">
                    Invite {nextVipLevel.requiredFromPrev} more {nextVipLevel.requiredFromPrev === 1 ? 'active person' : 'active people'} to reach {nextVipLevel.name}
                  </p>
                )}
              </div>

              <div className="w-full px-6 pb-6">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full bg-transparent text-[#7B2FFF] py-3 rounded-[12px] font-bold active:scale-95 transition-transform border-2 border-[#7B2FFF] text-[15px]"
                >
                  I know
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === "contact" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-200" onClick={() => setActiveModal(null)}>
            <div className="bg-[#1C0F3F] border border-white/10 rounded-[20px] w-full max-w-[320px] flex flex-col relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 pt-6 pb-4 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white tracking-wide">Customer Service</h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <a 
                  href={managerLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 transition-colors cursor-pointer group relative"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <MessageSquare className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-white font-bold text-[15px] mb-0.5">Manager Contact</h3>
                    <p className="text-white/50 text-[12px] truncate">{managerLink || "Chat via WhatsApp/Telegram"}</p>
                  </div>
                </a>
                {currentUser?.role === "admin" && (
                  <div className="px-1">
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-[#4DA8FF] focus:outline-none transition-colors"
                      placeholder="Enter Manager Link"
                      value={managerLink}
                      onChange={(e) => updateContactLinks(e.target.value, groupLink)}
                    />
                  </div>
                )}
                
                <a 
                  href={groupLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 transition-colors cursor-pointer group relative"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Users className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-white font-bold text-[15px] mb-0.5">Official Group</h3>
                    <p className="text-white/50 text-[12px] truncate">{groupLink || "Join our community"}</p>
                  </div>
                </a>
                {currentUser?.role === "admin" && (
                  <div className="px-1 flex flex-col gap-3">
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-[#4DA8FF] focus:outline-none transition-colors"
                      placeholder="Enter Group Link"
                      value={groupLink}
                      onChange={(e) => updateContactLinks(managerLink, e.target.value)}
                    />
                    <button 
                      onClick={() => {
                        alert("Contact links saved successfully!");
                        setActiveModal(null);
                      }}
                      className="w-full mt-1 bg-gradient-to-r from-[#4DA8FF] to-[#7B2FFF] text-white py-3 rounded-[12px] font-bold shadow-lg active:scale-95 transition-transform"
                    >
                      Save Links
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeModal === "about" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[#141a3a] border border-white/10 p-6 rounded-[2rem] w-full max-w-sm relative shadow-2xl max-h-[90vh] flex flex-col">
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white/50 hover:text-white"
              >
                <X size={18} />
              </button>
              <h3 className="text-xl font-bold mb-4 text-[#00D4FF]">About Us</h3>
              
              <div className="w-full h-40 rounded-xl mb-4 overflow-hidden relative flex-shrink-0">
                <div className="absolute inset-0 bg-[#3B82F6] blur-[20px] opacity-20"></div>
                <img 
                  src={aboutUsImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Equinor_logo.svg/1024px-Equinor_logo.svg.png"}
                  alt="Equinor" 
                  className="w-full h-full object-contain relative z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <div className="text-white/80 text-sm space-y-3 leading-relaxed overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-0">
                <p><strong>Company Name:</strong> Equinor ASA (Stock Code: EQNR)</p>
                <p>Equinor was founded in 1972, and its headquarters is located in Stavanger, Norway. It is the largest oil and gas operator on the Norwegian Continental Shelf (NCS) and one of the world's leading offshore oil, gas, and integrated energy companies.</p>
                <p>The company operates in more than 30 countries and its business spans various sectors including Conventional oil & natural gas, Offshore Wind, Floating Wind, Carbon Capture & Storage (CCS), Hydrogen fuel, Energy Storage, etc.</p>
                <div className="pt-4 mt-4 border-t border-white/10">
                  <p className="italic font-medium text-[#00D4FF] mb-2 text-base text-center leading-snug">"Energy for people.<br/>Progress for society.<br/>Searching for better."</p>
                  <p className="text-xs text-white/60 text-center">To supply energy for people, contribute to societal development, and search for better energy solutions.</p>
                </div>

                {/* FAQ Section */}
                <div className="pt-6 mt-6 border-t border-white/10">
                  <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#3B82F6]" />
                    FAQ - Payments
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <h5 className="font-semibold text-white text-sm mb-1.5">How fast are withdrawals processed?</h5>
                      <p className="text-white/60 text-xs leading-relaxed">Withdrawals are generally processed within 24 hours. Once approved, the funds are immediately routed to your designated bank account or USDT wallet.</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <h5 className="font-semibold text-white text-sm mb-1.5">Are there any deposit fees?</h5>
                      <p className="text-white/60 text-xs leading-relaxed">We do not charge any internal fees for deposits. Please ensure you transfer the exact amount displayed during the recharge process.</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <h5 className="font-semibold text-white text-sm mb-1.5">What is the minimum withdrawal amount?</h5>
                      <p className="text-white/60 text-xs leading-relaxed">The minimum withdrawal amount is ₦6,000 to ensure efficient processing and coverage of standard network operations.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full bg-transparent text-[#FF3B30] py-3 rounded-[12px] font-bold active:scale-95 transition-transform border-2 border-[#FF3B30]/30 hover:border-[#FF3B30] text-[15px]"
                >
                  Return to My Tab
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === "equinorConfirm" && equinorSelectedPlan && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 transition-opacity duration-200" onClick={() => setActiveModal(null)}>
            <div className="bg-white rounded-[20px] w-full max-w-[320px] flex flex-col items-center relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="w-full bg-[#1E1E2D] py-5 px-6 flex justify-between items-center text-white">
                <h3 className="font-bold text-[18px]">Confirm Purchase</h3>
                <button onClick={() => setActiveModal(null)} className="text-white/60 hover:text-white p-1">
                  ✕
                </button>
              </div>
              <div className="w-full py-6 px-6 bg-[#F9FAFB] flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-[14px]">Project</span>
                  <span className="text-gray-900 font-semibold text-[14px]">{equinorSelectedPlan.name}</span>
                </div>
                <div className="h-[1px] bg-gray-200 w-full" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-[14px]">Investment Amount (Unit)</span>
                  <span className="text-gray-900 font-bold text-[16px]">₦{equinorSelectedPlan.buyAmount.toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-gray-500 text-[14px]">Purchase Quantity (Quota)</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setBuyingQuantity(String(Math.max(1, Number(buyingQuantity) - 1)))}
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <input 
                      type="number"
                      value={buyingQuantity}
                      onChange={(e) => {
                         const val = Number(e.target.value);
                         if (equinorSelectedPlan.maxQuota && val > equinorSelectedPlan.maxQuota) {
                             setBuyingQuantity(String(equinorSelectedPlan.maxQuota));
                         } else {
                             setBuyingQuantity(e.target.value);
                         }
                      }}
                      className="flex-1 text-center font-bold text-[16px] border border-gray-200 rounded-lg py-2"
                      min="1"
                      max={equinorSelectedPlan.maxQuota || undefined}
                    />
                    <button 
                      onClick={() => {
                        const next = Number(buyingQuantity) + 1;
                        if (!equinorSelectedPlan.maxQuota || next <= equinorSelectedPlan.maxQuota) {
                            setBuyingQuantity(String(next));
                        }
                      }}
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  {equinorSelectedPlan.maxQuota > 0 && <span className="text-xs text-[#DC2626]">Max quota: {equinorSelectedPlan.maxQuota}</span>}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-[14px]">Total Investment</span>
                  <span className="text-[#DC2626] font-bold text-[16px]">₦{(equinorSelectedPlan.buyAmount * Number(buyingQuantity)).toLocaleString()}</span>
                </div>
                <div className="h-[1px] bg-gray-200 w-full" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-[14px]">Expected Daily Return</span>
                  <span className="text-[#28C76F] font-bold text-[16px]">
                    ₦{(equinorSelectedPlan.buyAmount * Number(buyingQuantity) * (equinorSelectedPlan.calculatedRoi / 100)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-[14px]">Cycle</span>
                  <span className="text-gray-900 font-semibold text-[14px]">{equinorSelectedPlan.days} Days</span>
                </div>
              </div>
              <div className="w-full px-6 py-5 bg-white border-t border-gray-100 flex gap-3">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-3 rounded-full border border-gray-200 text-gray-600 font-semibold text-[15px] active:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    handleInvest(equinorSelectedPlan.name, equinorSelectedPlan.buyAmount, equinorSelectedPlan.calculatedRoi, equinorSelectedPlan.days, equinorSelectedPlan.type, equinorSelectedPlan.fixedDailyReturn, equinorSelectedPlan.tPlusDays, Number(buyingQuantity));
                    setOrderTab(equinorSelectedPlan.type === "vip" ? "special" : equinorSelectedPlan.type);
                    setActiveTab("order");
                  }}
                  className="flex-1 py-3 rounded-full bg-[#7367F0] hover:bg-[#7367F0]/90 text-white font-semibold text-[15px] shadow-sm transform transition active:scale-95"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === "purchaseSuccess" && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 transition-opacity duration-200" onClick={() => setActiveModal(null)}>
            <div className="bg-white rounded-[20px] w-full max-w-[320px] flex flex-col items-center text-center relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="w-full py-8 px-6 pb-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-[24px] font-bold text-black mb-2 tracking-[-0.02em]">Purchase Successful!</h2>
                <p className="text-gray-500 text-[14px] leading-snug">
                  Your product is now active.
                </p>
              </div>

              <div className="w-full px-6 pb-6">
                <button 
                  onClick={() => {
                     setActiveModal(null);
                     setOrderTab("general");
                     setActiveTab("order");
                  }}
                  className="w-full bg-[#EC4899] text-white py-3 rounded-[12px] font-bold active:scale-95 transition-transform text-[15px] shadow-lg"
                >
                  View Active Products
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === "setup" && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#0A0E27] overflow-y-auto">
            {/* Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-[#6C5CE7]/20 to-transparent pointer-events-none z-0"></div>
            
            {/* Header */}
            <div className="flex items-center px-4 h-14 relative shrink-0 pt-safe z-10 border-b border-white/5">
              <button onClick={() => setActiveModal(null)} className="absolute left-4 p-2 text-white/80 active:scale-95 transition-transform">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-center text-white text-[17px] font-semibold tracking-wide">Setup</h2>
            </div>
            
            {/* Settings List */}
            <div className="flex-1 px-4 mt-4 z-10 space-y-1">
              <div 
                className="flex justify-between items-center py-5 border-b border-white/10 cursor-pointer active:bg-white/5 transition-colors"
                onClick={() => {
                  setSetupPhoneValue(currentUser?.phone || "");
                  setActiveModal("setupPhone");
                }}
              >
                <span className="text-[15px] font-medium text-white/90">Cell phone</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-mono text-white/50 tracking-wider">
                    {currentUser?.phone ? currentUser.phone.replace(/(\+?\d{2,3})(\d{2,3})\d{4}(\d{3,4})/, '$1 $2****$3') : '+234 ** **** 1234'}
                  </span>
                  <span className="text-[14px] text-white/40 font-medium ml-2">Edit</span>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </div>
              </div>
              
              <div 
                className="flex justify-between items-center py-5 border-b border-white/10 cursor-pointer active:bg-white/5 transition-colors"
                onClick={() => {
                  setSetupPasswordValue("");
                  setActiveModal("setupPassword");
                }}
              >
                <span className="text-[15px] font-medium text-white/90">Login Password</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] text-white/40 font-medium">Edit</span>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </div>
              </div>
            </div>
            
            {/* Primary Action Button */}
            <div className="px-5 pb-safe pb-8 z-10 pt-10">
              <button 
                onClick={() => {
                  logout();
                  setActiveModal(null);
                }}
                className="w-full h-[56px] rounded-[16px] bg-[#6C5CE7] hover:bg-[#5f51d3] text-white text-[16px] font-bold shadow-[0_8px_20px_rgba(108,92,231,0.25)] active:scale-[0.98] transition-all"
              >
                Log out
              </button>
            </div>
          </div>
        )}

        {activeModal === "setupPhone" && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#0A0E27] overflow-y-auto">
            {/* Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-[#6C5CE7]/20 to-transparent pointer-events-none z-0"></div>
            
            {/* Header */}
            <div className="flex items-center px-4 h-14 relative shrink-0 pt-safe z-10 border-b border-white/5">
              <button onClick={() => setActiveModal("setup")} className="absolute left-4 p-2 text-white/80 active:scale-95 transition-transform">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-center text-white text-[17px] font-semibold tracking-wide">Enter Mobile Number</h2>
            </div>

            <div className="flex-1 px-5 py-6 z-10 space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-white/80 font-medium ml-1">New Mobile Number</label>
                <input
                  type="tel"
                  value={setupPhoneValue}
                  onChange={(e) => setSetupPhoneValue(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter cell phone number"
                  className="w-full h-14 bg-[#141A46] border border-white/10 rounded-full px-5 text-white placeholder-white/30 font-medium focus:outline-none focus:border-[#7B2FF7]/50 transition-colors"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    if (!setupPhoneValue) {
                      alert("Please enter a valid phone number.");
                      return;
                    }
                    updatePhone(setupPhoneValue);
                    alert("Cell phone updated successfully.");
                    setActiveModal("setup");
                  }}
                  className="w-full h-[56px] rounded-full bg-[#A855F7] text-white font-bold text-[16px] shadow-[0_4px_14px_rgba(168,85,247,0.4)] active:scale-95 transition-transform"
                >
                  Confirm Registration
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === "setupPassword" && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#0A0E27] overflow-y-auto">
            {/* Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-[#6C5CE7]/20 to-transparent pointer-events-none z-0"></div>
            
            {/* Header */}
            <div className="flex items-center px-4 h-14 relative shrink-0 pt-safe z-10 border-b border-white/5">
              <button onClick={() => setActiveModal("setup")} className="absolute left-4 p-2 text-white/80 active:scale-95 transition-transform">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-center text-white text-[17px] font-semibold tracking-wide">Set Login Password</h2>
            </div>

            <div className="flex-1 px-5 py-6 z-10 space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-white/80 font-medium ml-1">Old Password</label>
                <input
                  type="password"
                  value={setupOldPasswordValue}
                  onChange={(e) => setSetupOldPasswordValue(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full h-14 bg-[#141A46] border border-white/10 rounded-full px-5 text-white placeholder-white/30 font-medium focus:outline-none focus:border-[#7B2FF7]/50 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-white/80 font-medium ml-1">New Password</label>
                <input
                  type="password"
                  value={setupPasswordValue}
                  onChange={(e) => setSetupPasswordValue(e.target.value)}
                  placeholder="Enter new login password"
                  className="w-full h-14 bg-[#141A46] border border-white/10 rounded-full px-5 text-white placeholder-white/30 font-medium focus:outline-none focus:border-[#7B2FF7]/50 transition-colors"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    if (currentUser?.password && setupOldPasswordValue !== currentUser.password) {
                      alert("Incorrect old password.");
                      return;
                    }
                    if (!setupPasswordValue) {
                      alert("Please enter a valid new password.");
                      return;
                    }
                    updatePassword(setupPasswordValue);
                    alert("Password updated successfully.");
                    setSetupOldPasswordValue("");
                    setSetupPasswordValue("");
                    setActiveModal("setup");
                  }}
                  className="w-full h-[56px] rounded-full bg-[#A855F7] text-white font-bold text-[16px] shadow-[0_4px_14px_rgba(168,85,247,0.4)] active:scale-95 transition-transform"
                >
                  Confirm Setup
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === "setupLanguage" && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#0A0E27] overflow-y-auto">
            {/* Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-[#6C5CE7]/20 to-transparent pointer-events-none z-0"></div>
            
            {/* Header */}
            <div className="flex items-center px-4 h-14 relative shrink-0 pt-safe z-10 border-b border-white/5">
              <button onClick={() => setActiveModal("setup")} className="absolute left-4 p-2 text-white/80 active:scale-95 transition-transform">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-center text-white text-[17px] font-semibold tracking-wide">Language</h2>
            </div>

            <div className="flex-1 px-5 py-6 z-10 space-y-4">
              {['English', 'Spanish', 'French', 'Portuguese'].map((lang) => (
                <div 
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setActiveModal("setup");
                  }}
                  className={`flex justify-between items-center py-4 px-5 rounded-2xl cursor-pointer transition-colors border ${
                    language === lang ? 'bg-[#7B2FF7]/20 border-[#7B2FF7]/50' : 'bg-white/5 border-white/5 active:bg-white/10'
                  }`}
                >
                  <span className="text-[15px] font-medium text-white/90">{lang}</span>
                  {language === lang && (
                    <div className="w-5 h-5 rounded-full bg-[#7B2FF7] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeModal === "setupAlertThreshold" && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#0A0E27] overflow-y-auto">
            {/* Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-[#6C5CE7]/20 to-transparent pointer-events-none z-0"></div>
            
            {/* Header */}
            <div className="flex items-center px-4 h-14 relative shrink-0 pt-safe z-10 border-b border-white/5">
              <button onClick={() => setActiveModal("setup")} className="absolute left-4 p-2 text-white/80 active:scale-95 transition-transform">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-center text-white text-[17px] font-semibold tracking-wide">Set Balance Alert</h2>
            </div>

            <div className="flex-1 px-5 py-6 z-10 space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-white/80 font-medium ml-1">Alert Threshold (₦)</label>
                <input
                  type="number"
                  value={setupAlertThresholdValue}
                  onChange={(e) => setSetupAlertThresholdValue(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full h-14 bg-[#141A46] border border-white/10 rounded-full px-5 text-white placeholder-white/30 font-medium focus:outline-none focus:border-[#7B2FF7]/50 transition-colors"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    const thresholdNum = Number(setupAlertThresholdValue);
                    if (isNaN(thresholdNum) || thresholdNum < 0) {
                      alert("Please enter a valid threshold greater than 0.");
                      return;
                    }
                    updateBalanceAlertThreshold(thresholdNum);
                    setToastMessage("Balance alert threshold updated!");
                    setTimeout(() => setToastMessage(null), 2000);
                    setActiveModal("setup");
                  }}
                  className="w-full h-[56px] rounded-full bg-[#A855F7] text-white font-bold text-[16px] shadow-[0_4px_14px_rgba(168,85,247,0.4)] active:scale-95 transition-transform"
                >
                  Confirm Setup
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === "fundingDetails" && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#0A0E2E] overflow-y-auto">
            {/* Background Logo */}
            <div className="fixed inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden z-0">
              <EquinorStar className="w-[60vw] max-w-[300px] text-white absolute" />
            </div>
            {/* Top Purple Gradient Glow */}
            <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-[#7B2FFF]/20 to-transparent pointer-events-none z-0"></div>

            {/* Header */}
            <div className="flex items-center px-4 h-14 relative shrink-0 pt-safe z-10">
              <button onClick={() => setActiveModal(null)} className="absolute left-4 p-2 text-white active:scale-95 transition-transform z-10">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-bold text-white w-full text-center pointer-events-none select-none">
                Funding Details
              </h2>
            </div>

            {/* Filters Area */}
            <div className="flex flex-col px-4 mt-6 z-10 shrink-0 gap-3">
               {/* Search */}
               <div className="w-full bg-[#1C0F3F] rounded-xl px-4 py-2 flex items-center border border-white/5">
                 <svg className="w-5 h-5 text-white/40 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                 <input 
                   type="text"
                   placeholder="Search transactions..."
                   value={txSearch}
                   onChange={e => setTxSearch(e.target.value)}
                   className="bg-transparent text-[14px] text-white w-full outline-none placeholder:text-white/40"
                 />
               </div>

               {/* Dropdown Filters */}
               <div className="flex gap-3">
                 <select 
                   value={txFilterStatus} 
                   onChange={e => setTxFilterStatus(e.target.value as any)}
                   className="bg-[#1C0F3F] text-white text-[13px] rounded-xl px-3 py-2 border border-white/5 outline-none flex-1 appearance-none"
                 >
                   <option value="all">All Statuses</option>
                   <option value="pending">Pending</option>
                   <option value="completed">Completed</option>
                   <option value="failed">Failed</option>
                 </select>
                 
                 <select 
                   value={txFilterDate} 
                   onChange={e => setTxFilterDate(e.target.value as any)}
                   className="bg-[#1C0F3F] text-white text-[13px] rounded-xl px-3 py-2 border border-white/5 outline-none flex-1 appearance-none"
                 >
                   <option value="all">All Time</option>
                   <option value="today">Today</option>
                   <option value="week">Past Week</option>
                   <option value="month">Past Month</option>
                 </select>
               </div>

               {/* Type Tabs */}
               <div className="relative flex w-full bg-[#1C0F3F] p-1 rounded-xl">
                 <div
                    className={`absolute top-1 bottom-1 w-[calc(33.33%-2.66px)] bg-[#7B2FFF] rounded-lg transition-transform duration-300 shadow-sm ${
                      fundingTab === 'all' ? 'translate-x-0' : fundingTab === 'deposit' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-[calc(200%+8px)]'
                    }`}
                  />
                  <button 
                     onClick={() => setFundingTab('all')}
                     className={`flex-1 flex justify-center items-center py-2 text-[14px] font-bold z-10 transition-colors cursor-pointer select-none ${fundingTab === 'all' ? 'text-white' : 'text-white/60'}`}
                  >
                     All
                  </button>
                  <button 
                     onClick={() => setFundingTab('deposit')}
                     className={`flex-1 flex justify-center items-center py-2 text-[14px] font-bold z-10 transition-colors cursor-pointer select-none ${fundingTab === 'deposit' ? 'text-white' : 'text-white/60'}`}
                  >
                     Recharge
                  </button>
                  <button 
                     onClick={() => setFundingTab('withdrawal')}
                     className={`flex-1 flex justify-center items-center py-2 text-[14px] font-bold z-10 transition-colors cursor-pointer select-none ${fundingTab === 'withdrawal' ? 'text-white' : 'text-white/60'}`}
                  >
                     Withdrawal
                  </button>
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 mt-6 pb-safe z-10">
              {(() => {
                const myTransactions = transactions.filter(t => {
                  if (t.userId !== currentUser?.id) return false;
                  
                  // Filter by Type
                  if (fundingTab === 'deposit' && t.type !== 'deposit') return false;
                  if (fundingTab === 'withdrawal' && t.type !== 'withdrawal') return false;
                  
                  // Filter by Status
                  if (txFilterStatus !== 'all' && t.status !== txFilterStatus) return false;
                  
                  // Filter by Date
                  if (txFilterDate !== 'all') {
                    const txDate = new Date(t.date);
                    const now = new Date();
                    if (txFilterDate === 'today' && txDate.toDateString() !== now.toDateString()) return false;
                    if (txFilterDate === 'week' && txDate.getTime() < now.getTime() - 7 * 24 * 60 * 60 * 1000) return false;
                    if (txFilterDate === 'month' && txDate.getTime() < now.getTime() - 30 * 24 * 60 * 60 * 1000) return false;
                  }
                  
                  // Filter by Search
                  if (txSearch) {
                    const searchLower = txSearch.toLowerCase();
                    const txStr = `${t.type === 'deposit' ? 'recharge' : 'withdrawal'} ${t.amount} ${t.status} ${new Date(t.date).toLocaleString()}`.toLowerCase();
                    if (!txStr.includes(searchLower)) return false;
                  }
                  
                  return true;
                }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                
                if (myTransactions.length === 0) {
                  return (
                    <div className="flex-1 flex flex-col items-center justify-center h-full -mt-10 pt-20">
                      <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                         <div className="absolute inset-0 bg-[#3B82F6] blur-[60px] opacity-20 rounded-full"></div>
                         <svg width="80" height="100" viewBox="0 0 80 100" fill="none" className="relative z-10 drop-shadow-[0_10px_20px_rgba(123,47,255,0.4)]">
                           <linearGradient id="bookmarkGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                             <stop stopColor="#4DA8FF" />
                             <stop offset="1" stopColor="#7B2FFF" />
                           </linearGradient>
                           <path d="M10,0 C4.5,0 0,4.5 0,10 L0,100 L40,80 L80,100 L80,10 C80,4.5 75.5,0 70,0 L10,0 Z" fill="url(#bookmarkGrad)"/>
                           <path d="M40,20 L45,35 L60,35 L48,45 L52,60 L40,50 L28,60 L32,45 L20,35 L35,35 Z" fill="#FFD700" className="drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
                         </svg>
                         <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 160 160">
                           <circle cx="20" cy="40" r="4" fill="#4DA8FF" opacity="0.6" />
                           <circle cx="140" cy="60" r="3" fill="#A855F7" opacity="0.8" />
                           <circle cx="30" cy="120" r="5" fill="#FFD700" opacity="0.4" />
                           <circle cx="130" cy="110" r="4" fill="#3B82F6" opacity="0.5" />
                           <path d="M 40 100 C 35 100 30 105 30 110 C 30 115 35 120 40 120 L 120 120 C 125 120 130 115 130 110 C 130 105 125 100 120 100 Z" fill="rgba(80,80,200,0.15)" />
                           <path d="M 45 105 C 45 95 55 90 65 95 C 70 85 85 85 90 95 C 100 90 110 95 110 105 Z" fill="rgba(80,80,200,0.2)" />
                         </svg>
                      </div>
                      <h3 className="text-white/60 text-[16px] mb-8 font-medium">
                        {txSearch ? 'No transactions match your search' : 
                         fundingTab === 'deposit' ? 'No recharge records' : 
                         fundingTab === 'withdrawal' ? 'No withdrawal records' : 
                         'No records found'}
                      </h3>
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col gap-3">
                    {myTransactions.map(t => (
                      <div key={t.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col gap-1">
                            <span className="text-white font-semibold text-[15px]">{t.type === 'deposit' ? 'Recharge' : 'Withdrawal'}</span>
                            <span className="text-white/40 text-[11px] font-mono">{new Date(t.date).toLocaleString()}</span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`font-bold text-[16px] ${t.type === 'deposit' ? 'text-[#00D4FF]' : 'text-[#FF4DA8]'}`}>
                              {t.type === 'deposit' ? '+' : '-'}₦{formatCurrency(t.amount)}
                            </span>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1.5 ${t.status === 'completed' ? 'bg-green-500/20 text-green-400' : t.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                              {t.status === 'completed' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.8)]"></span>}
                              {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        {t.type === 'withdrawal' && t.status === 'pending' && (
                          <div className="pt-2 border-t border-white/5">
                            <div className="flex justify-between items-center text-[10px] text-white/50 mb-2 font-medium px-1">
                              <span className="text-yellow-400">Submitted</span>
                              <span className="text-yellow-400">Processing (2-24h)</span>
                              <span>Completed</span>
                            </div>
                            <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full w-[50%] relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        )}
                        {t.type === 'withdrawal' && t.status === 'completed' && (
                          <div className="pt-2 border-t border-white/5">
                            <div className="flex justify-between items-center text-[10px] text-white/50 mb-2 font-medium px-1">
                              <span className="text-green-400">Submitted</span>
                              <span className="text-green-400">Processing</span>
                              <span className="text-green-400">Completed</span>
                            </div>
                            <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="absolute top-0 left-0 h-full bg-green-500 rounded-full w-full"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {activeModal === "deposit" && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#0A0A1F] overflow-hidden pt-safe pb-4">
            <div className="absolute inset-0 bg-gradient-to-b from-[#7B2FF7]/20 to-[#3A0CA3]/20 opacity-50 z-0 pointer-events-none" />
            
            {/* App Bar */}
            <div className="flex flex-row items-center justify-between h-[48px] px-4 relative shrink-0 z-10 w-full">
              <button 
                onClick={() => setActiveModal(null)} 
                className="w-[44px] h-[44px] flex items-center justify-center -ml-2 text-white active:opacity-70"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-semibold text-white absolute left-0 right-0 text-center pointer-events-none">
                Recharge
              </h2>
              <div className="w-[44px]"></div>
            </div>

            {/* Tab Switcher */}
            <div className="flex flex-row justify-evenly h-[48px] z-10 w-full mb-2">
              <button onClick={() => setDepositMethod("ngn")} className={`flex-1 flex flex-col items-center justify-center relative ${depositMethod !== "ngn" && "opacity-50"}`}>
                <span className="text-white font-medium text-base">Money</span>
                {depositMethod === "ngn" && <div className="absolute bottom-0 w-8 h-[2px] bg-[#7B2FF7]"></div>}
              </button>
              {adminUsdtAddress && (
                 <button onClick={() => setDepositMethod("usdt")} className={`flex-1 flex flex-col items-center justify-center relative ${depositMethod !== "usdt" && "opacity-50"}`}>
                   <span className="text-white font-medium text-base">USDT</span>
                   {depositMethod === "usdt" && <div className="absolute bottom-0 w-8 h-[2px] bg-[#7B2FF7]"></div>}
                 </button>
              )}
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto px-4 z-10 w-full">
              {/* Amount Selection Card */}
              <div className="bg-white rounded-[20px] p-4 w-full">
                {/* Header Row */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-[#7B2FF7]/10 flex items-center justify-center text-[#7B2FF7] font-bold text-xs pl-0.5">₦</div>
                    <button 
                      onClick={() => {
                        setFundingTab("recharge");
                        setActiveModal("fundingDetails");
                      }}
                      className="text-[#7B2FF7] text-sm font-medium"
                    >
                      Recharge Record &gt;
                    </button>
                  </div>
                  {/* Wallet illustration */}
                  <div className="w-10 h-10 bg-[#7B2FF7]/10 rounded-full flex items-center justify-center">
                    <Landmark className="w-5 h-5 text-[#7B2FF7]" />
                  </div>
                </div>

                {/* Amount Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[12000, 50000, 100000, 500000, 1000000, 2000000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => {
                        triggerHaptic();
                        setDepositAmount(amount.toString());
                      }}
                      className={`h-[48px] rounded-xl flex items-center justify-center border ${
                        Number(depositAmount) === amount ? 'bg-[#7B2FF7] border-[#7B2FF7]' : 'bg-[#F5F5F5] border-transparent'
                      } active:scale-95 transition-transform`}
                    >
                      <span className={`text-[13px] font-bold tracking-tight ${Number(depositAmount) === amount ? 'text-white' : 'text-[#212121]'}`}>
                        ₦{(amount / 1000).toLocaleString()}K
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="w-full h-[48px] bg-[#F5F5F5] rounded-xl flex items-center px-4 mb-2">
                  <span className="text-[#212121] font-medium mr-1">₦</span>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Custom amount value"
                    className="flex-1 bg-transparent border-none text-[15px] font-medium text-[#212121] placeholder:text-[#9e9e9e] focus:outline-none focus:ring-0 p-0"
                  />
                </div>

                {/* Footer Note */}
                <span className="text-[#757575] text-[12px]">Minimum deposit ₦6,000</span>
              </div>
              
              {depositMethod === "usdt" && adminUsdtAddress && (
                <div className="bg-white rounded-[20px] p-4 mt-4 w-full border border-[#7B2FF7]/20 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#7B2FF7]/10 flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-[#7B2FF7]" />
                    </div>
                    <div>
                      <h4 className="text-[#212121] font-bold text-[14px]">USDT Deposit Address</h4>
                      <p className="text-[#757575] text-[11px]">Send TRC20 only (1 USDT ≈ $1)</p>
                    </div>
                  </div>
                  <div className="bg-[#F5F5F5] rounded-xl p-3 flex items-center justify-between gap-2 border border-gray-200">
                    <span className="text-[#212121] text-[13px] font-mono font-medium truncate flex-1">{adminUsdtAddress}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(adminUsdtAddress);
                        alert("Address copied!");
                      }}
                      className="bg-[#7B2FF7] text-white px-4 py-2 rounded-lg text-xs font-bold active:scale-95 transition-transform shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                  
                  <div className="mt-4 flex flex-col gap-2">
                    <span className="text-[#212121] font-bold text-[13px]">Transaction Hash / Narration</span>
                    <p className="text-xs text-slate-500">
                      Please enter the transaction hash. You may also include your Main ID <span className="font-bold text-[#7B2FF7]">({currentUser?.referralCode})</span> for reference.
                    </p>
                    <input
                      type="text"
                      placeholder={`e.g. TX Hash or ID: ${currentUser?.referralCode}`}
                      value={depositReference}
                      onChange={e => setDepositReference(e.target.value)}
                      className="w-full bg-[#F5F5F5] border-transparent rounded-xl px-4 py-3 text-[14px] text-[#212121] placeholder:text-[#9e9e9e] focus:outline-none focus:ring-1 focus:ring-[#7B2FF7] focus:border-[#7B2FF7] transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Bar - Payment Summary */}
            <div className="h-[72px] bg-[#1A1A2E] z-10 w-full shrink-0 flex items-center justify-between px-4 mt-auto rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
              <div className="flex flex-col">
                <span className="text-white/60 text-xs">Need to pay</span>
                <span className="text-white text-xl font-bold">₦{Number(depositAmount) > 0 ? Number(depositAmount).toLocaleString() : '0'}</span>
              </div>

              {Number(depositAmount) >= 6000 ? (
                depositMethod === "usdt" ? (
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setPaymentProcessingState({ step: 1, message: "Verifying transaction on the blockchain..." });
                      setTimeout(() => {
                        setPaymentProcessingState({ step: 2, message: "Confirming payment details..." });
                        setTimeout(() => {
                          setPaymentProcessingState({ step: 3, message: "Finalizing deposit..." });
                          setTimeout(() => {
                            setPaymentProcessingState(null);
                            const amt = Number(depositAmount);
                            if (amt > 0) {
                              requestDeposit(amt, depositReference);
                            } else {
                              alert("Please enter a valid deposit amount.");
                            }
                            setDepositAmount("");
                            setDepositReference("");
                            setSuccessAnimTitle("Deposit Requested");
                            setSuccessAnimMessage("Deposit request submitted! Awaiting CBN/SEC confirmation.");
                            setSuccessAnimAmount(amt);
                            setActiveModal("successAnimated");
                          }, 1500)
                        }, 1500)
                      }, 1500)
                    }}
                    className="h-[48px] rounded-xl px-8 font-bold text-[15px] bg-[#16A34A] text-white active:scale-95 transition-transform shadow-lg shadow-[#16A34A]/30"
                  >
                    I Have Paid
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      triggerHaptic();
                      if (systemDepositAccounts.length === 0) {
                        alert("No deposit accounts available. Please try again later or use USDT.");
                        return;
                      }
                      setDepositCheckoutTimer(1800);
                      setDepositCheckoutAccountIndex(Math.floor(Math.random() * systemDepositAccounts.length));
                      setActiveModal("depositCheckout");
                    }}
                    className="h-[48px] rounded-xl px-8 font-bold text-[15px] bg-[#7B2FF7] text-white active:opacity-80 transition-opacity"
                  >
                    Payment
                  </button>
                )
              ) : (
                <button disabled className="h-[48px] rounded-xl px-8 font-bold text-[15px] bg-[#7B2FF7] opacity-50 text-white cursor-not-allowed">
                  Payment
                </button>
              )}
            </div>
            
          </div>
        )}

        {activeModal === "depositCheckout" && (
          <div className="absolute inset-0 z-50 flex flex-col bg-slate-50 overflow-y-auto pt-safe">
            <div className="flex flex-row items-center justify-between h-[56px] px-4 shrink-0 bg-white border-b border-slate-200">
              <button onClick={() => setActiveModal("deposit")} className="text-slate-900">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-slate-900 font-bold text-lg pointer-events-none">Transfer Required</h2>
              <div className="w-[24px]"></div>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
                <h3 className="text-slate-500 text-sm mb-1 uppercase tracking-widest font-bold">Waiting for payment</h3>
                <div className="text-4xl text-slate-900 font-black font-mono tracking-widest">
                  {Math.floor(depositCheckoutTimer / 60).toString().padStart(2, '0')}:{(depositCheckoutTimer % 60).toString().padStart(2, '0')}
                </div>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">Please complete the transfer to the account below within the time limit. If time expires, a new account will appear.</p>
              </div>

              {systemDepositAccounts.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-2">
                  <div className="bg-slate-100/50 p-4 border-b border-slate-200 text-center">
                    <h4 className="text-slate-600 font-bold text-sm uppercase tracking-wide">Deposit Destination</h4>
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Amount</span>
                      <span className="text-xl font-bold text-slate-900">₦{Number(depositAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Bank Name</span>
                      <span className="text-slate-900 font-bold text-sm">{systemDepositAccounts[depositCheckoutAccountIndex % systemDepositAccounts.length]?.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Account Name</span>
                      <span className="text-slate-900 font-bold text-sm tracking-wide">{systemDepositAccounts[depositCheckoutAccountIndex % systemDepositAccounts.length]?.accountName}</span>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Account Number</span>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-3 flex items-center justify-between font-mono text-slate-900 font-bold text-lg tracking-wider shadow-inner">
                          {systemDepositAccounts[depositCheckoutAccountIndex % systemDepositAccounts.length]?.accountNumber}
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(systemDepositAccounts[depositCheckoutAccountIndex % systemDepositAccounts.length]?.accountNumber);
                            alert("Account number copied!");
                          }}
                          className="px-6 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold active:scale-95 transition-transform shadow-md"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                <span className="text-slate-600 font-bold text-sm uppercase tracking-wide">Bank Transaction Note / Narration</span>
                <p className="text-xs text-slate-500">
                  Please paste your bank transaction note below. Include your Main ID <span className="font-bold text-blue-600">({currentUser?.referralCode})</span> so the admin can quickly confirm your deposit.
                </p>
                <input
                  type="text"
                  placeholder={`e.g. Deposit for ID: ${currentUser?.referralCode}`}
                  value={depositReference}
                  onChange={e => setDepositReference(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <button
                onClick={() => {
                  triggerHaptic();
                  setPaymentProcessingState({ step: 1, message: "Verifying transaction with the bank..." });
                  setTimeout(() => {
                    setPaymentProcessingState({ step: 2, message: "Confirming account details..." });
                    setTimeout(() => {
                      setPaymentProcessingState({ step: 3, message: "Finalizing deposit..." });
                      setTimeout(() => {
                        setPaymentProcessingState(null);
                        const amt = Number(depositAmount);
                        if (amt > 0) {
                          requestDeposit(amt, depositReference);
                        } else {
                          alert("Please enter a valid deposit amount.");
                        }
                        setDepositAmount("");
                        setDepositReference("");
                        setSuccessAnimTitle("Deposit Requested");
                        setSuccessAnimMessage("Deposit request submitted! Awaiting CBN/SEC confirmation.");
                        setSuccessAnimAmount(amt);
                        setActiveModal("successAnimated");
                      }, 1500)
                    }, 1500)
                  }, 1500)
                }}
                className="w-full bg-[#16A34A] text-white font-bold py-4 rounded-xl mt-4 active:scale-95 transition-transform shadow-lg shadow-[#16A34A]/30 text-[15px]"
              >
                I Have Paid
              </button>
            </div>
          </div>
        )}

        {activeModal === "withdraw" && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#0A0A1F] overflow-hidden p-4 pt-safe pb-8">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A1F] to-[#1C0F3F] opacity-50 z-0 pointer-events-none" />
            
            {/* App Bar */}
            <div className="flex flex-row items-center justify-between h-[56px] relative shrink-0 z-10 w-full mb-4">
              <button 
                onClick={() => setActiveModal(null)} 
                className="w-[44px] h-[44px] flex items-center justify-center -ml-2 text-white active:scale-95 transition-transform z-10"
                aria-label="Go back"
                role="button"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-semibold text-white absolute left-0 right-0 text-center pointer-events-none">
                Withdraw
              </h2>
              <div className="w-[44px]"></div>
            </div>

            {/* Bank Card Details */}
            {currentUser?.bankDetails && (
              <div className="w-full bg-gradient-to-br from-[#1C0F3F] to-[#2D1B69] rounded-2xl p-6 border border-white/10 shadow-xl relative overflow-hidden mb-6 z-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
                
                {/* User ID Section at the top of card surface */}
                <div className="mb-6 flex justify-between items-center relative z-10 pb-4 border-b border-white/10">
                  <div className="text-white/60 text-[11px] font-bold uppercase tracking-wider">User ID</div>
                  <div className="text-[#00D4FF] font-mono font-bold tracking-wider text-base">{currentUser.referralCode}</div>
                </div>

                <div className="mb-6 flex justify-between items-start relative z-10">
                  <div>
                    <div className="text-white/60 text-[11px] font-bold uppercase tracking-wider mb-1">Bank Name</div>
                    <div className="text-white font-bold text-lg">{currentUser.bankDetails.bankName}</div>
                  </div>
                  <Landmark className="text-white/20 w-8 h-8" />
                </div>
                <div 
                  className="mb-6 relative z-10 cursor-pointer active:opacity-70 transition-opacity group flex justify-between items-center"
                  onClick={() => {
                    navigator.clipboard.writeText(currentUser.bankDetails!.accountNumber);
                    setToastMessage("Copied to clipboard!");
                    setTimeout(() => setToastMessage(null), 2000);
                  }}
                >
                  <div>
                    <div className="text-white/60 text-[11px] font-bold uppercase tracking-wider mb-1">Account Number</div>
                    <div className="text-white font-mono text-xl tracking-widest">{currentUser.bankDetails.accountNumber}</div>
                  </div>
                  <Copy className="w-5 h-5 text-white/30 group-hover:text-white/80 transition-colors" />
                </div>
                <div className="relative z-10">
                  <div className="text-white/60 text-[11px] font-bold uppercase tracking-wider mb-1">Account Name</div>
                  <div className="text-white font-bold text-[15px]">{currentUser.bankDetails.accountName}</div>
                </div>
              </div>
            )}

            {/* Withdrawal Input Section */}
            <div className="flex flex-col relative z-10 w-full mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-white/80">Withdrawal amount</span>
                <button 
                  role="button" 
                  aria-label="Go to Rules" 
                  onClick={() => setActiveModal("withdrawRules")}
                  className="text-sm font-medium text-white/80 active:opacity-70 transition-opacity"
                >
                  Rules
                </button>
              </div>

              <div className="flex items-center">
                 <span className="text-white text-base font-medium mr-1">₦</span>
                 <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0"
                    className="flex-1 bg-transparent border-none text-white text-base font-medium placeholder:text-white/40 focus:outline-none focus:ring-0 px-0"
                 />
              </div>
              <div className="mt-1">
                <button 
                   role="button" 
                   onClick={() => {
                     triggerHaptic();
                     setWithdrawAmount("6000");
                   }} 
                   className="text-base font-medium text-white/80 active:opacity-70 transition-opacity"
                 >
                   Minimum withdrawal ₦6,000
                 </button>
              </div>

              <div className="h-[1px] bg-white/20 my-4" />

              <div className="flex justify-between items-center mb-4">
                 <span className="text-sm font-medium text-white/80">Total balance: ₦{formatCurrency(currentUser?.balance || 0)}</span>
                 <button 
                   role="button" 
                   onClick={() => {
                     triggerHaptic();
                     setWithdrawAmount((currentUser?.balance || 0).toString());
                   }}
                   aria-label="Withdraw full balance"
                   className="text-[#7B2FF7] text-sm font-medium active:opacity-70 transition-opacity"
                 >
                   ALL
                 </button>
              </div>

              <button
                role="button"
                className="w-full h-[48px] rounded-full bg-white/10 flex items-center justify-between px-5 active:opacity-70 transition-opacity"
                onClick={() => {
                  setFundingTab("withdrawal");
                  setActiveModal("fundingDetails");
                }}
              >
                <div className="flex flex-col items-start">
                  <span className="text-white font-medium">Details</span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/50" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col relative z-10 overflow-y-auto w-full">
              {(() => {
                const myWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.userId === currentUser?.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                
                if (myWithdrawals.length === 0) {
                  return (
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <EquinorStar className="w-24 h-24 text-white/20 mb-4" />
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col gap-3">
                    {myWithdrawals.map(w => (
                      <div key={w.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-white font-medium text-base mb-1">Withdrawal</span>
                          <span className="text-white/50 text-xs">{new Date(w.date).toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-white font-bold text-lg">₦{formatCurrency(w.amount)}</span>
                          <span className={`text-xs font-bold ${w.status === 'approved' ? 'text-green-400' : w.status === 'rejected' ? 'text-red-400' : 'text-amber-400'}`}>
                            {w.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Primary CTA */}
            <div className="shrink-0 mt-4 z-10 w-full relative">
              {currentUser?.bankDetails ? (
                <button
                  role="button"
                  onClick={handleWithdraw}
                  disabled={isProcessing || !withdrawAmount || Number(withdrawAmount) <= 0}
                  className="w-full h-[48px] rounded-[16px] bg-[#7B2FF7] text-white text-base font-medium flex items-center justify-center shadow-[0_4px_16px_rgba(123,47,255,0.4)] active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
                >
                  {isProcessing ? "Processing..." : "Withdraw"}
                </button>
              ) : (
                <button
                  role="button"
                  onClick={() => {
                    setBankAccountNumber("");
                    setBankAccountName("");
                    setSelectedBankCode("");
                    setIsEditingBank(true);
                    setActiveModal("bankDetails");
                  }}
                  className="w-full h-[48px] rounded-[16px] bg-[#7B2FF7] text-white text-base font-medium flex items-center justify-center shadow-[0_4px_16px_rgba(123,47,255,0.4)] active:scale-95 transition-transform"
                >
                  Add bank card
                </button>
              )}
            </div>
          </div>
        )}

        {activeModal === "withdrawRules" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[#141a3a] border border-white/10 p-6 rounded-[2rem] w-full max-w-sm relative shadow-2xl flex flex-col">
              <button
                onClick={() => setActiveModal("withdraw")}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white/50 hover:text-white"
              >
                <X size={18} />
              </button>
              <h3 className="text-xl font-bold mb-4 text-[#00D4FF]">Withdrawal Rules</h3>
              
              <div className="overflow-y-auto pr-2 scrollbar-hide flex-1 space-y-4 text-white/80 text-sm leading-relaxed">
                <p>1. Ensure your bank details are correct before requesting a withdrawal.</p>
                <p>2. The minimum withdrawal amount is ₦6,000.</p>
                <p>3. Withdrawals typically arrive between 2 to 24 hours after submitting the withdrawal request. Delays may occur during weekends or public holidays.</p>
                <p>4. Please wait for the current withdrawal request to be completed before submitting a new one.</p>
              </div>
              
              <div className="mt-6 border-t border-white/10 pt-4">
                <button
                  onClick={() => setActiveModal("withdraw")}
                  className="w-full h-12 bg-gradient-to-r from-[#00D4FF] to-[#3B82F6] rounded-full text-white font-bold tracking-wide active:scale-95 transition-transform"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === "commissionRecord" && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#0A0A1F] overflow-hidden">
            {/* Background Logo */}
            <div className="fixed inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden z-0">
              <EquinorStar className="w-[60vw] max-w-[300px] text-white absolute" />
            </div>
            {/* App Bar */}
            <div className="flex flex-row items-center justify-between px-4 h-[56px] relative shrink-0 pt-safe z-10 w-full">
              <button 
                onClick={() => setActiveModal(null)} 
                className="p-2 text-white active:scale-95 transition-transform z-10"
                aria-label="Go back"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-semibold text-white absolute left-0 right-0 text-center pointer-events-none">
                Commission records
              </h2>
              {/* Placeholder for visual balance */}
              <div className="w-10"></div>
            </div>

            {/* Summary Card */}
            <div className="px-4 mt-4 shrink-0 z-10 mb-4">
              <div className="w-full h-[48px] rounded-[56px] bg-gradient-to-r from-[#7B2FF7] to-[#3A0CA3] flex flex-row items-center justify-between px-6 shadow-lg">
                <span className="text-sm font-medium text-white/70">Commission</span>
                <span className="text-xl font-bold text-white">₦ {formatCurrency(currentUser?.referralEarnings || 0)}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide z-10 pb-20 px-4">
              {(() => {
                const myCommissions = commissions.filter(c => c.userId === currentUser?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                if (myCommissions.length === 0) {
                  return (
                    <div className="h-full flex flex-col items-center justify-center -mt-20">
                      <EquinorStar className="w-24 h-24 text-white/20 mb-4" />
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col gap-3">
                    {myCommissions.map(c => {
                      const fromUserFull = users.find(u => u.id === c.fromUserId);
                      return (
                        <div key={c.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="text-white font-semibold text-sm">
                              {c.type === 'vip_upgrade' ? 'VIP Upgrade Bonus' : `Level ${c.level} Bonus`}
                            </span>
                            <span className="text-white/60 text-[10px] mt-0.5">{new Date(c.date).toLocaleString()}</span>
                            <span className="text-white/40 text-[10px] mt-0.5">From: {fromUserFull?.referralCode || "Unknown"}</span>
                          </div>
                          <div className="text-[#00D4FF] font-bold text-base">
                            +₦{formatCurrency(c.amount)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {activeModal === "incomeRecord" && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#0A0A1F] overflow-hidden">
            {/* Background Logo */}
            <div className="fixed inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden z-0">
              <EquinorStar className="w-[60vw] max-w-[300px] text-white absolute" />
            </div>
            {/* App Bar */}
            <div className="flex flex-row items-center justify-between px-4 h-[56px] relative shrink-0 pt-safe z-10 w-full">
              <button 
                onClick={() => setActiveModal(null)} 
                className="p-2 text-white active:scale-95 transition-transform z-10"
                aria-label="Back"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-semibold text-white absolute left-0 right-0 text-center pointer-events-none">
                Income Records
              </h2>
              {/* Placeholder for visual balance */}
              <div className="w-10"></div>
            </div>

            {/* Summary Card */}
            <div className="px-4 mt-4 mb-4 shrink-0 z-10">
              <div className="w-full h-[48px] rounded-[28px] bg-gradient-to-r from-[#7B2FF7] to-[#3A0CA3] flex flex-row items-center justify-between px-6 shadow-lg">
                <span className="text-sm font-medium text-white/70">Total Collected Income</span>
                <span className="text-xl font-bold text-white">
                  ₦ {formatCurrency(incomeRecords.filter(r => r.userId === currentUser?.id).reduce((sum, r) => sum + r.amount, 0))}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide z-10 pb-20 px-4">
              {(() => {
                const myIncomes = incomeRecords.filter(r => r.userId === currentUser?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                if (myIncomes.length === 0) {
                  return (
                    <div className="h-full flex flex-col items-center justify-center -mt-20">
                      <EquinorStar className="w-24 h-24 text-white/20 mb-4" />
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col gap-3">
                    {myIncomes.map(record => (
                      <div key={record.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-white font-semibold text-sm">
                            {record.planName}
                          </span>
                          <span className="text-white/60 text-[10px] mt-0.5">{new Date(record.date).toLocaleString()}</span>
                        </div>
                        <div className="text-[#00D4FF] font-bold text-base">
                          +₦{formatCurrency(record.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {activeModal === "addDepositAccount" && (
          <div className="absolute inset-0 z-50 bg-[#0A0E2E]/80 backdrop-blur-md flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom flex flex-col max-h-[80%] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#0A0E2E]">Add Deposit Account</h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Bank Name</label>
                  <input
                    type="text"
                    value={newDepositAccountBank}
                    onChange={(e) => setNewDepositAccountBank(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                    placeholder="e.g. Opay"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Account Name</label>
                  <input
                    type="text"
                    value={newDepositAccountName}
                    onChange={(e) => setNewDepositAccountName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                    placeholder="e.g. Equinor Global"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Account Number</label>
                  <input
                    type="text"
                    value={newDepositAccountNumber}
                    onChange={(e) => setNewDepositAccountNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium font-mono"
                    placeholder="e.g. 1234567890"
                  />
                </div>
                
                <button
                  onClick={() => {
                    if (!newDepositAccountBank || !newDepositAccountName || !newDepositAccountNumber) return alert('Please fill all fields');
                    addSystemDepositAccount({
                      bankName: newDepositAccountBank,
                      accountName: newDepositAccountName,
                      accountNumber: newDepositAccountNumber
                    });
                    setNewDepositAccountBank("Opay");
                    setNewDepositAccountName("");
                    setNewDepositAccountNumber("");
                    setActiveModal(null);
                  }}
                  className="w-full bg-gradient-to-r from-[#00D4FF] to-[#7B2FF7] text-white font-bold py-4 rounded-xl mt-4 active:scale-95 transition-transform shadow-lg shadow-purple-500/30"
                >
                  Save Account
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === "addProduct" && (
          <div className="absolute inset-0 z-50 bg-[#0A0E2E]/80 backdrop-blur-md flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom flex flex-col max-h-[80%] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#0A0E2E]">Add New Product</h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-slate-400 hover:text-[#0A0E2E] p-2"
                >
                  ✕
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newProductName && newProductRoi && newProductMin && newProductDays && newProductType) {
                    setIsProcessingProduct(true);
                    setTimeout(() => {
                      addProduct({
                        name: newProductName,
                        title: newProductTitle,
                        roi: Number(newProductRoi),
                        min: Number(newProductMin),
                        days: Number(newProductDays),
                        tPlusDays: Number(newProductTPlusDays),
                        maxQuota: Number(newProductQuota),
                        type: newProductType,
                        imageUrl: newProductImageUrl,
                        promotionalUnlockDate: newProductPromoUnlock || undefined,
                      });
                      setNewProductName("");
                      setNewProductTitle("EQUINOR");
                      setNewProductRoi("");
                      setNewProductMin("");
                      setNewProductDays("30");
                      setNewProductTPlusDays("1");
                      setNewProductQuota("0");
                      setNewProductType("general");
                      setNewProductImageUrl("");
                      setNewProductPromoUnlock("");
                      setIsProcessingProduct(false);
                      setActiveModal(null);
                      // alert("Product added successfully!");
                    }, 1200);
                  } else {
                    alert("Please fill all fields");
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Product Title (Optional)</label>
                  <input
                    type="text"
                    value={newProductTitle}
                    onChange={(e) => setNewProductTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                    placeholder="e.g. EQUINOR"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                    placeholder="e.g. Starter VIP"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Daily Return (ROI %)</label>
                  <input
                    type="number"
                    required
                    value={newProductRoi}
                    onChange={(e) => setNewProductRoi(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                    placeholder="e.g. 12"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Min. Deposit</label>
                  <input
                    type="number"
                    required
                    value={newProductMin}
                    onChange={(e) => setNewProductMin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                    placeholder="e.g. 20000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    value={newProductDays}
                    onChange={(e) => setNewProductDays(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">T+ (Earning Cycle in Days)</label>
                  <input
                    type="number"
                    required
                    value={newProductTPlusDays}
                    onChange={(e) => setNewProductTPlusDays(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                    placeholder="e.g. 1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Max Quota (0 for unlimited)</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setNewProductQuota(String(Math.max(0, Number(newProductQuota) - 1)))} className="bg-slate-200 p-3 rounded-lg font-bold text-slate-700 w-12 flex items-center justify-center hover:bg-slate-300">-</button>
                    <input
                      type="number"
                      required
                      value={newProductQuota}
                      onChange={(e) => setNewProductQuota(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium text-center"
                      placeholder="e.g. 1"
                    />
                    <button type="button" onClick={() => setNewProductQuota(String(Number(newProductQuota) + 1))} className="bg-slate-200 p-3 rounded-lg font-bold text-slate-700 w-12 flex items-center justify-center hover:bg-slate-300">+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Product Type (Tab)</label>
                  <div className="relative">
                    <select
                      value={newProductType}
                      onChange={(e) => setNewProductType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium appearance-none"
                    >
                      <option value="general">General</option>
                      <option value="vip">VIP</option>
                      <option value="special">Special</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Product Image (Optional)</label>
                  <label className="flex items-center justify-center w-full bg-slate-50 border border-slate-200 border-dashed rounded-xl px-4 py-3 text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors">
                    <span className="text-sm font-medium">{newProductImageUrl ? "Image Selected" : "Tap to Upload Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const url = await processImageUpload(file);
                            setNewProductImageUrl(url);
                          } catch (error) {
                            console.error("Failed to upload product image", error);
                          }
                        }
                      }}
                    />
                  </label>
                  {newProductImageUrl && (
                    <div className="mt-2 w-full h-32 rounded-xl overflow-hidden bg-slate-100 relative group">
                      <img src={newProductImageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                         type="button"
                         onClick={() => setNewProductImageUrl("")}
                         className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-red-500 transition-colors opacity-80 group-hover:opacity-100"
                      >
                         <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Promotional Unlock Time (Optional)</label>
                  <input
                    type="datetime-local"
                    value={newProductPromoUnlock}
                    onChange={(e) => setNewProductPromoUnlock(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">If set, users cannot buy this product until this time.</p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#7B2FF7] to-[#00D4FF] text-white py-4 rounded-xl font-bold tracking-wider mt-4"
                >
                  Create Product
                </button>
              </form>
            </div>

            {/* Loading Overlay */}
            {(isLoadingProductTypes || isProcessingProduct) && (
              <div className="absolute inset-0 z-50 bg-[#0A0E2E]/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in rounded-t-3xl border-t border-white/10">
                <Loader2 className="w-10 h-10 text-[#00D4FF] animate-spin mb-4" />
                <span className="text-white font-medium tracking-wider">
                  {isProcessingProduct ? "Saving..." : "Loading..."}
                </span>
              </div>
            )}
          </div>
        )}

        {activeModal === "editProduct" && editingProduct && (
          <div className="absolute inset-0 z-50 bg-[#0A0E2E]/80 backdrop-blur-md flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom flex flex-col max-h-[80%] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#0A0E2E]">Edit Product</h2>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    setEditingProduct(null);
                  }}
                  className="text-slate-400 hover:text-[#0A0E2E] p-2"
                >
                  ✕
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newProductName && newProductRoi && newProductMin && newProductDays && newProductType) {
                    setIsProcessingProduct(true);
                    setTimeout(() => {
                      editProduct(editingProduct.id, {
                        name: newProductName,
                        title: newProductTitle,
                        roi: Number(newProductRoi),
                        min: Number(newProductMin),
                        days: Number(newProductDays),
                        tPlusDays: Number(newProductTPlusDays),
                        maxQuota: Number(newProductQuota),
                        type: newProductType,
                        imageUrl: newProductImageUrl,
                        promotionalUnlockDate: newProductPromoUnlock || undefined,
                      });
                      setNewProductName("");
                      setNewProductTitle("EQUINOR");
                      setNewProductRoi("");
                      setNewProductMin("");
                      setNewProductDays("30");
                      setNewProductTPlusDays("1");
                      setNewProductQuota("0");
                      setNewProductType("general");
                      setNewProductImageUrl("");
                      setNewProductPromoUnlock("");
                      setIsProcessingProduct(false);
                      setActiveModal(null);
                      setEditingProduct(null);
                    }, 1200);
                  } else {
                    alert("Please fill all fields");
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Product Title (Optional)</label>
                  <input
                    type="text"
                    value={newProductTitle}
                    onChange={(e) => setNewProductTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                    placeholder="e.g. EQUINOR"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                    placeholder="e.g. Starter VIP"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Daily Return (ROI %)</label>
                  <input
                    type="number"
                    required
                    value={newProductRoi}
                    onChange={(e) => setNewProductRoi(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                    placeholder="e.g. 12"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Min. Deposit</label>
                  <input
                    type="number"
                    required
                    value={newProductMin}
                    onChange={(e) => setNewProductMin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                    placeholder="e.g. 20000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    value={newProductDays}
                    onChange={(e) => setNewProductDays(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">T+ (Earning Cycle in Days)</label>
                  <input
                    type="number"
                    required
                    value={newProductTPlusDays}
                    onChange={(e) => setNewProductTPlusDays(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                    placeholder="e.g. 1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Max Quota (0 for unlimited)</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setNewProductQuota(String(Math.max(0, Number(newProductQuota) - 1)))} className="bg-slate-200 p-3 rounded-lg font-bold text-slate-700 w-12 flex items-center justify-center hover:bg-slate-300">-</button>
                    <input
                      type="number"
                      required
                      value={newProductQuota}
                      onChange={(e) => setNewProductQuota(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium text-center"
                      placeholder="e.g. 1"
                    />
                    <button type="button" onClick={() => setNewProductQuota(String(Number(newProductQuota) + 1))} className="bg-slate-200 p-3 rounded-lg font-bold text-slate-700 w-12 flex items-center justify-center hover:bg-slate-300">+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Product Type (Tab)</label>
                  <div className="relative">
                    <select
                      value={newProductType}
                      onChange={(e) => setNewProductType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium appearance-none"
                    >
                      <option value="general">General</option>
                      <option value="vip">VIP</option>
                      <option value="special">Special</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Product Image (Optional)</label>
                  <label className="flex items-center justify-center w-full bg-slate-50 border border-slate-200 border-dashed rounded-xl px-4 py-3 text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors">
                    <span className="text-sm font-medium">{newProductImageUrl ? "Image Selected" : "Tap to Upload Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const url = await processImageUpload(file);
                            setNewProductImageUrl(url);
                          } catch (error) {
                            console.error("Failed to upload product image", error);
                          }
                        }
                      }}
                    />
                  </label>
                  {newProductImageUrl && (
                    <div className="mt-2 w-full h-32 rounded-xl overflow-hidden bg-slate-100 relative group">
                      <img src={newProductImageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                         type="button"
                         onClick={() => setNewProductImageUrl("")}
                         className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-red-500 transition-colors opacity-80 group-hover:opacity-100"
                      >
                         <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Promotional Unlock Time (Optional)</label>
                  <input
                    type="datetime-local"
                    value={newProductPromoUnlock}
                    onChange={(e) => setNewProductPromoUnlock(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">If set, users cannot buy this product until this time.</p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#7B2FF7] to-[#00D4FF] text-white py-4 rounded-xl font-bold tracking-wider mt-4"
                >
                  Update Product
                </button>
              </form>
            </div>

            {/* Loading Overlay */}
            {(isLoadingProductTypes || isProcessingProduct) && (
              <div className="absolute inset-0 z-50 bg-[#0A0E2E]/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in rounded-t-3xl border-t border-white/10">
                <Loader2 className="w-10 h-10 text-[#00D4FF] animate-spin mb-4" />
                <span className="text-white font-medium tracking-wider">
                  {isProcessingProduct ? "Saving..." : "Loading..."}
                </span>
              </div>
            )}
          </div>
        )}

        {activeModal === "bankDetails" && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#0B1033] overflow-hidden">
            {/* Top Purple Gradient Background */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#7B2FF7]/30 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center px-4 h-14 relative shrink-0 pt-safe z-10 border-b border-white/5">
              <button onClick={() => setActiveModal(null)} className="absolute left-4 p-2 text-white/90 active:scale-95 transition-transform z-10">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-bold text-white w-full text-center">
                {!isEditingBank && currentUser?.bankDetails ? "My Bank Card" : "Add bank card"}
              </h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-6 z-10 flex flex-col space-y-5">
              {!isEditingBank && currentUser?.bankDetails ? (
                <>
                  {/* Saved Card View */}
                  <div className="w-full bg-gradient-to-br from-[#1C0F3F] to-[#2D1B69] rounded-2xl p-6 border border-white/10 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
                    
                    {/* User ID Section at the top of card surface */}
                    <div className="mb-6 flex justify-between items-center relative z-10 pb-4 border-b border-white/10">
                      <div className="text-white/60 text-[11px] font-bold uppercase tracking-wider">User ID</div>
                      <div className="text-[#00D4FF] font-mono font-bold tracking-wider text-base">{currentUser.referralCode}</div>
                    </div>

                    <div className="mb-6 flex justify-between items-start relative z-10">
                      <div>
                        <div className="text-white/60 text-[11px] font-bold uppercase tracking-wider mb-1">Bank Name</div>
                        <div className="text-white font-bold text-lg">{currentUser.bankDetails.bankName}</div>
                      </div>
                      <Landmark className="text-white/20 w-8 h-8" />
                    </div>
                    <div 
                      className="mb-6 relative z-10 cursor-pointer active:opacity-70 transition-opacity group flex justify-between items-center"
                      onClick={() => {
                        navigator.clipboard.writeText(currentUser.bankDetails!.accountNumber);
                        setToastMessage("Copied to clipboard!");
                        setTimeout(() => setToastMessage(null), 2000);
                      }}
                    >
                      <div>
                        <div className="text-white/60 text-[11px] font-bold uppercase tracking-wider mb-1">Account Number</div>
                        <div className="text-white font-mono text-xl tracking-widest">{currentUser.bankDetails.accountNumber}</div>
                      </div>
                      <Copy className="w-5 h-5 text-white/30 group-hover:text-white/80 transition-colors" />
                    </div>
                    <div className="relative z-10">
                      <div className="text-white/60 text-[11px] font-bold uppercase tracking-wider mb-1">Account Name</div>
                      <div className="text-white font-bold text-[15px]">{currentUser.bankDetails.accountName}</div>
                    </div>
                  </div>

                  <div className="pt-8 mt-auto">
                    <button
                      onClick={() => {
                        setBankAccountNumber("");
                        setBankAccountName("");
                        setSelectedBankCode("");
                        setIsEditingBank(true);
                      }}
                      className="w-full h-[56px] rounded-full bg-white/10 border border-white/20 text-white font-bold text-[16px] active:scale-95 transition-transform"
                    >
                      Change Bank Account
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] text-white/80 font-medium ml-1">Name</label>
                    <input
                      type="text"
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                      placeholder="Please enter real name"
                      className="w-full h-14 bg-[#141A46] border border-white/10 rounded-full px-5 text-white placeholder-white/30 font-medium focus:outline-none focus:border-[#7B2FF7]/50 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] text-white/80 font-medium ml-1">Bank Account</label>
                    <input
                      type="text"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="Please enter your Bank Account"
                      className="w-full h-14 bg-[#141A46] border border-white/10 rounded-full px-5 text-white placeholder-white/30 font-medium focus:outline-none focus:border-[#7B2FF7]/50 transition-colors tracking-wide"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] text-white/80 font-medium ml-1">Select Bank</label>
                    <div className="relative">
                      <select
                        value={selectedBankCode}
                        onChange={(e) => setSelectedBankCode(e.target.value)}
                        className="w-full h-14 bg-[#141A46] border border-white/10 rounded-full px-5 text-white font-medium focus:outline-none focus:border-[#7B2FF7]/50 transition-colors appearance-none"
                      >
                        <option value="" className="text-white/30">Select</option>
                        {banksList.map((b) => (
                          <option key={b.code} value={b.code}>{b.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => {
                        if (!bankAccountName || !bankAccountNumber || !selectedBankCode) {
                          alert("Please fill out all fields.");
                          return;
                        }
                        const bankNameStr = banksList.find((b) => b.code === selectedBankCode)?.name || "";
                        updateBankDetails({
                          accountName: bankAccountName,
                          accountNumber: bankAccountNumber,
                          bankCode: selectedBankCode,
                          bankName: bankNameStr,
                        });
                        setActiveModal(null);
                      }}
                      className="w-full h-[56px] rounded-full bg-[#A855F7] text-white font-bold text-[16px] shadow-[0_4px_14px_rgba(168,85,247,0.4)] active:scale-95 transition-transform"
                    >
                      Save
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Loading Overlay */}
            {isLoadingBanks && (
              <div className="absolute inset-0 z-50 bg-[#0B1033]/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
                <Loader2 className="w-10 h-10 text-[#A855F7] animate-spin mb-4" />
                <span className="text-white font-medium tracking-wider">Loading...</span>
              </div>
            )}
          </div>
        )}

        {activeModal === "sysAnnouncement" && (
          <div className="absolute inset-0 z-[90] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={() => setActiveModal(null)} />
            
            <div className="relative w-full max-w-[320px] bg-[#1C0F3F] border border-white/10 rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 text-center relative overflow-hidden border-b border-yellow-500/30">
                <div className="absolute top-0 right-0 py-1 px-4 text-[10px] font-bold bg-yellow-500/30 text-yellow-300 rounded-bl-xl border-b border-l border-yellow-500/30">
                  SYSTEM
                </div>
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 mx-auto mb-3 flex items-center justify-center backdrop-blur-md">
                  <span className="text-3xl">📢</span>
                </div>
                <h3 className="text-xl font-bold text-yellow-100 tracking-wide">Announcement</h3>
              </div>
              
              <div className="p-6 flex flex-col items-center">
                <p className="text-white text-[15px] leading-relaxed mb-6 whitespace-pre-wrap text-center max-h-[300px] overflow-y-auto custom-scrollbar w-full">
                  {announcement}
                </p>
                
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-[16px] shadow-[0_4px_12px_rgba(245,158,11,0.4)] active:scale-95 transition-transform"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === "download" && (
          <div className="absolute inset-0 z-[90] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={() => setActiveModal(null)} />
            
            <div className="relative w-full max-w-[320px] bg-[#1C0F3F] border border-white/10 rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-[#7B2FFF] to-[#00D4FF] p-6 text-center relative overflow-hidden border-b border-white/10">
                <div className="w-16 h-16 rounded-full bg-white/20 mx-auto mb-3 flex items-center justify-center backdrop-blur-md">
                  <Download className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide">Download App</h3>
              </div>
              
              <div className="p-6 flex flex-col items-center">
                <div className="text-white/80 text-[14px] leading-relaxed mb-6 text-left w-full space-y-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white">📱 iOS (Safari):</span> 
                    <span>Tap the <span className="font-mono bg-white/10 px-1 py-0.5 rounded text-xs text-white">Share</span> icon, then select <span className="font-mono bg-white/10 px-1 py-0.5 rounded text-xs text-white">Add to Home Screen</span>.</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-3">
                    <span className="font-bold text-white">🤖 Android (Chrome):</span> 
                    <span>Tap the <span className="font-mono bg-white/10 px-1 py-0.5 rounded text-xs text-white">Menu</span> (⋮) icon, then select <span className="font-mono bg-white/10 px-1 py-0.5 rounded text-xs text-white">Install app</span> or <span className="font-mono bg-white/10 px-1 py-0.5 rounded text-xs text-white">Add to Home Screen</span>.</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7B2FFF] to-[#00D4FF] text-white font-bold text-[16px] shadow-[0_4px_12px_rgba(123,47,255,0.4)] active:scale-95 transition-transform"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}

        {showWithdrawConfirm && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowWithdrawConfirm(false)} />
            
            <div className="relative w-full max-w-[320px] bg-white rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#7B2FF7] to-[#00D4FF] p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 mx-auto mb-3 flex items-center justify-center backdrop-blur-md">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide">Confirm Withdrawal</h3>
              </div>
              
              {/* Content */}
              <div className="p-6 flex flex-col items-center text-center">
                <p className="text-slate-600 text-[15px] font-medium leading-relaxed mb-4">
                  Are you sure you want to withdraw <br/><span className="text-black font-bold text-xl block mt-2">₦{Number(withdrawAmount).toLocaleString()}</span>
                </p>

                {/* Status Timeline Graphic */}
                <div className="w-full bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 relative shadow-sm">
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider text-left mb-4">Expected Timeline</div>
                  <div className="flex justify-between items-center relative px-2">
                    <div className="absolute top-[12px] left-[20px] right-[20px] h-[2px] bg-slate-200 z-0"></div>
                    
                    <div className="flex flex-col items-center z-10 gap-2 w-[60px]">
                      <div className="w-6 h-6 rounded-full bg-[#FFB020] text-white flex items-center justify-center text-[12px] shadow-md ring-4 ring-slate-50">
                        <Clock className="w-3 h-3" />
                      </div>
                      <span className="text-[9px] font-bold text-[#FFB020] uppercase tracking-wider text-center">Pending</span>
                    </div>
                    
                    <div className="flex flex-col items-center z-10 gap-2 w-[60px]">
                      <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-500 flex items-center justify-center text-[12px] shadow-sm ring-4 ring-slate-50">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">Approved</span>
                    </div>
                    
                    <div className="flex flex-col items-center z-10 gap-2 w-[60px]">
                      <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-500 flex items-center justify-center text-[12px] shadow-sm ring-4 ring-slate-50">
                        <Banknote className="w-3 h-3" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">Processed</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setShowWithdrawConfirm(false)}
                    className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold active:scale-95 transition-transform"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={executeWithdrawal}
                    className="flex-1 py-3.5 rounded-xl bg-[#7B2FF7] text-white font-bold shadow-lg shadow-[#7B2FF7]/30 active:scale-95 transition-transform"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModal === "successAnimated" && (
          <div className="absolute inset-0 z-[999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white border border-slate-200 rounded-3xl p-8 max-w-[340px] w-full flex flex-col items-center shadow-[0_20px_60px_rgba(34,197,94,0.3)] relative overflow-hidden"
            >
              <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-[#34C759] to-[#34C759]/50" />
              {/* Animated Glow */}
              <motion.div 
                animate={{ 
                  background: ["radial-gradient(circle, rgba(52,199,89,0.15) 0%, rgba(255,255,255,0) 70%)", "radial-gradient(circle, rgba(52,199,89,0.1) 0%, rgba(255,255,255,0) 70%)", "radial-gradient(circle, rgba(52,199,89,0.15) 0%, rgba(255,255,255,0) 70%)"] 
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-0 pointer-events-none"
              />
              
              {/* Lottie-style Drawing Checkmark */}
              <div className="relative z-10 w-24 h-24 mb-5">
                <motion.svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-[0_4px_12px_rgba(52,199,89,0.4)]">
                  <motion.circle 
                    cx="25" cy="25" r="23" 
                    fill="none" 
                    stroke="url(#successGrad)" 
                    strokeWidth="4" 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  <motion.path 
                    d="M15,25 L22,32 L35,17" 
                    fill="none" 
                    stroke="#16a34a" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4ade80" />
                      <stop offset="100%" stopColor="#16a34a" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </div>

              <motion.h3 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-2xl font-black text-slate-800 mb-1 z-10 relative text-center tracking-tight"
              >
                {successAnimTitle}
              </motion.h3>

              {successAnimAmount !== null && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", delay: 0.9, bounce: 0.5 }}
                  className="bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-200 font-black text-xl mb-3 shadow-[0_2px_10px_rgba(34,197,94,0.1)] z-10"
                >
                  +₦{successAnimAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </motion.div>
              )}

              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-slate-500 text-center text-[15px] font-medium z-10 relative mb-8 leading-relaxed"
              >
                {successAnimMessage}
              </motion.p>
              
              <motion.button
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={() => setActiveModal(null)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#34C759] to-[#28A745] text-white font-black uppercase tracking-wider active:scale-95 transition-transform z-10 relative shadow-lg shadow-green-500/30 text-[15px]"
              >
                Continue
              </motion.button>
            </motion.div>
          </div>
        )}

        {paymentProcessingState && (
          <div className="absolute inset-0 z-[9999] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6">
            <div className="relative flex flex-col items-center max-w-[300px] w-full text-center">
              {/* Spinning loading indicator */}
              <div className="w-24 h-24 mb-6 relative flex items-center justify-center">
                <svg className="animate-spin text-[#16A34A] w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-slate-800">
                  {paymentProcessingState.step}
                  <span className="text-slate-400 text-lg">/3</span>
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Processing...</h3>
              <p className="text-slate-500 font-medium text-[15px] max-w-[250px]">
                {paymentProcessingState.message}
              </p>
              
              <div className="flex gap-3 mt-8">
                {[1, 2, 3].map(step => (
                  <div key={step} className={`w-3 h-3 rounded-full transition-colors duration-500 ${paymentProcessingState.step >= step ? 'bg-[#16A34A] scale-110' : 'bg-slate-200'}`} />
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {showConfetti && (
        <Confetti 
          width={window.innerWidth} 
          height={window.innerHeight} 
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 99999, pointerEvents: 'none' }}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 left-0 right-0 z-[9999] flex flex-col items-center gap-2 pointer-events-none px-4">
        <AnimatePresence>
          {notifications.map(notif => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className={`w-full max-w-sm p-4 rounded-xl shadow-2xl flex items-start gap-3 pointer-events-auto backdrop-blur-md border ${
                notif.type === 'success' ? 'bg-emerald-500/90 border-emerald-400' : 
                notif.type === 'error' ? 'bg-rose-500/90 border-rose-400' : 
                'bg-blue-500/90 border-blue-400'
              } text-white`}
            >
              <div className="shrink-0 mt-0.5">
                {notif.type === 'success' && <CheckSquare className="w-5 h-5" />}
                {notif.type === 'error' && <Info className="w-5 h-5" />}
                {notif.type === 'info' && <Info className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm tracking-wide">{notif.title}</h4>
                <p className="text-white/90 text-xs mt-0.5 leading-relaxed">{notif.message}</p>
              </div>
              <button onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))} className="shrink-0 text-white/70 hover:text-white active:scale-95 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Support Chat Floating Button */}
      {currentUser && !isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="absolute bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg flex items-center justify-center z-40 transform transition hover:scale-105 active:scale-95"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          {currentUser.role === 'admin' && chatMessages.filter(m => !m.receiverId && m.senderId !== currentUser?.id).length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {chatMessages.filter(m => !m.receiverId && m.senderId !== currentUser?.id).length}
            </span>
          )}
        </button>
      )}

      {/* Support Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-[60] flex flex-col bg-slate-50"
          >
            {/* Header */}
            <div className="bg-[#0A0E2E] text-white p-4 flex items-center justify-between shadow-md shrink-0 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 border-2 border-slate-700">
                  <span className="font-bold text-sm">CS</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-[16px] leading-tight">Customer Support</h3>
                    <span className="flex items-center gap-1 w-fit bg-green-400/20 text-green-300 border border-green-400/30 px-1.5 py-[2px] rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                      Online
                    </span>
                  </div>
                  <p className="text-[12px] text-white/70">We typically reply in a few minutes</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" ref={(el) => { if (el) { el.scrollTop = el.scrollHeight; } }}>
              <div className="flex flex-col gap-1 items-start max-w-[85%]">
                <div className="bg-white text-slate-800 p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 text-[14px]">
                  Hello! How can I help you today?
                </div>
                <span className="text-[10px] text-slate-400 ml-1">Current Session</span>
              </div>
              
              {chatMessages.filter(m => {
                if (currentUser?.role === 'admin') {
                   if (adminChatUserContext) {
                     return m.senderId === adminChatUserContext || m.receiverId === adminChatUserContext;
                   }
                   return true;
                }
                return m.senderId === currentUser?.id || m.receiverId === currentUser?.id;
              }).map((msg) => {
                const isMine = msg.senderId === currentUser?.id;
                const txt = (msg.text || '').trim();
                const isImageMsg = txt.includes('IMAGE:::') || (txt.startsWith('http') && txt.includes('cloudinary.com'));
                let imgUrl = txt.replace('IMAGE:::', '').trim();
                
                return (
                  <div key={msg.id} className={`flex flex-col gap-1 max-w-[85%] ${isMine ? 'self-end items-end' : 'self-start items-start'}`}>
                    <div className={`p-3 rounded-2xl shadow-sm text-[14px] leading-snug overflow-hidden break-words ${isImageMsg ? 'bg-transparent !p-0 shadow-none border-none' : isMine ? 'bg-[#7B2FFF] text-white rounded-tr-sm' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'}`}>
                      {isImageMsg ? (
                        <div onClick={() => setViewImage(imgUrl)} className="cursor-pointer">
                          <img src={imgUrl} alt="Attachment" className="max-w-[220px] sm:max-w-[260px] max-h-[300px] object-cover rounded-xl border-2 border-white/20 bg-black/5" />
                        </div>
                      ) : (
                        txt
                      )}
                    </div>
                    <div className="flex items-center gap-2 mx-1">
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                        {currentUser?.role === 'admin' && !isMine ? ` (from ${users.find(u=>u.id === msg.senderId)?.email || msg.senderId})` : ''}
                      </span>
                      {currentUser?.role === 'admin' && !isMine && !adminChatUserContext && (
                        <button 
                          onClick={() => setAdminChatUserContext(msg.senderId)}
                          className="text-[10px] text-blue-500 hover:underline font-bold"
                        >
                          Reply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="bg-white p-3 shrink-0 border-t border-slate-200 safe-bottom">
              {currentUser?.role === 'admin' && (
                <div className="mb-2 flex flex-col gap-2">
                  <select 
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 outline-none"
                    value={adminChatUserContext || ""}
                    onChange={(e) => setAdminChatUserContext(e.target.value)}
                  >
                    <option value="" disabled>Select user to reply to...</option>
                    {Array.from(new Set(chatMessages.filter(m => m.senderId !== currentUser.id).map(m => m.senderId))).map(uid => {
                      const u = users.find(x => x.id === uid);
                      return <option key={uid} value={uid}>{u?.name || u?.email || u?.phone || uid}</option>;
                    })}
                  </select>
                  {adminChatUserContext && (
                    <button 
                      onClick={() => setAdminChatUserContext(null)}
                      className="w-full px-3 py-2 bg-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-300"
                    >
                      Clear Target User
                    </button>
                  )}
                </div>
              )}
              <div className="flex gap-2 items-center">
                <label className="w-12 h-12 rounded-full flex flex-col items-center justify-center shrink-0 transition-colors bg-slate-100/80 text-slate-500 hover:text-slate-700 hover:bg-slate-200 cursor-pointer relative overflow-hidden shadow-sm">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          setIsUploadingChatImg(true);
                          const b64 = await processImageUpload(file);
                          if (currentUser?.role === 'admin' && !adminChatUserContext) {
                            alert("Select a user to reply to!");
                            return;
                          }
                          sendChatMessage('IMAGE:::' + b64, adminChatUserContext || undefined);
                        } catch (err) {
                          alert("Failed to upload image.");
                        } finally {
                          setIsUploadingChatImg(false);
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                  {isUploadingChatImg ? (
                    <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ImagePlus className="w-5 h-5" />
                  )}
                </label>
                <input 
                  type="text" 
                  value={chatInput}
                  disabled={isUploadingChatImg}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && chatInput.trim()) {
                      if (currentUser?.role === 'admin' && !adminChatUserContext) return alert("Select a user to reply to!");
                      sendChatMessage(chatInput.trim(), adminChatUserContext || undefined);
                      setChatInput("");
                    }
                  }}
                  className="flex-1 h-[48px] bg-slate-100/80 border border-slate-200 rounded-[24px] px-5 text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF]/50 focus:border-[#7B2FFF] transition-all"
                  placeholder="Type a message..."
                />
                <button
                  onClick={() => {
                    if (chatInput.trim()) {
                      if (currentUser?.role === 'admin' && !adminChatUserContext) return alert("Select a user to reply to!");
                      sendChatMessage(chatInput.trim(), adminChatUserContext || undefined);
                      setChatInput("");
                    }
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-sm ${chatInput.trim() ? 'bg-[#7B2FFF] text-white' : 'bg-slate-100 text-slate-400'}`}
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setViewImage(null)}
          >
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={viewImage} 
              alt="Full screen preview" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
            />
            <button 
              onClick={() => setViewImage(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function PillButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 group"
    >
      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center relative overflow-hidden">
        <div
          className="relative z-10 fill-transparent"
          style={{
            background: "linear-gradient(135deg, #7B2FF7 0%, #00D4FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "#7B2FF7",
          }}
        >
          <svg width="0" height="0">
            <linearGradient
              id="purple-blue-grad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop stopColor="#7B2FF7" offset="0%" />
              <stop stopColor="#00D4FF" offset="100%" />
            </linearGradient>
          </svg>
          <div className="[&>svg]:stroke-[url(#purple-blue-grad)] [&>svg]:w-7 [&>svg]:h-7">
            {icon}
          </div>
        </div>
      </div>
      <span className="text-[#0A0E2E] text-xs font-semibold tracking-wide mt-1 drop-shadow-sm">
        {label}
      </span>
    </div>
  );
}

function TabItem({
  icon,
  label,
  active = false,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1 transition-colors ${active ? "text-[#7B61FF]" : "text-[#999999]"}`}
    >
      <div className={active ? "drop-shadow-[0_0_4px_rgba(123,97,255,0.4)]" : ""}>
        {icon}
        {badge !== undefined && badge > 0 && (
          <div className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
            {badge > 99 ? '99+' : badge}
          </div>
        )}
      </div>
      <span className={`text-[12px] ${active ? "font-medium" : "font-normal"}`}>{label}</span>
    </button>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    (this as any).state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    (this as any).setState({ errorInfo });
  }

  render() {
    const s = (this as any).state;
    if (s.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', backgroundColor: '#fff', position: 'fixed', inset: 0, zIndex: 9999, overflow: 'auto' }}>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Wait to view error details</summary>
            {s.error && s.error.toString()}
            <br />
            {s.errorInfo?.componentStack}
          </details>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </ErrorBoundary>
  );
}
