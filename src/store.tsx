import React, { createContext, useContext, useState, useEffect } from "react";
import { VIP_LEVELS, VIP_MEMBER_EXCLUSIVE_TIERS } from "./services/vip";
import { getDailyIncome } from "./lib/earnings";
import { supabase } from "./supabase";

export type UserRole = "user" | "admin";


export type TransactionStatus = "pending" | "approved" | "rejected";
export type TransactionType = "deposit" | "withdrawal";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: string;
  bankDetails?: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    reference?: string;
  };
}

export interface Investment {
  id: string;
  userId: string;
  planName: string;
  amount: number;
  expectedRoi: number;
  fixedDailyReturn?: number;
  startDate: string;
  endDate: string;
  lastCollectedDate?: string;
  status: "active" | "completed";
  expiryNotified?: boolean;
  tPlusDays?: number;
  quantity?: number;
}

export interface IncomeRecord {
  id: string;
  userId: string;
  investmentId: string;
  planName: string;
  amount: number;
  date: string;
}

export interface Commission {
  id: string;
  userId: string;
  fromUserId: string;
  amount: number;
  date: string;
  level: number;
  type: string;
}

export interface Product {
  id: string;
  name: string;
  title?: string;
  roi: number;
  min: number;
  days: number;
  type: "general" | "vip" | "special" | "redemption_code";
  fixedDailyReturn?: number;
  imageUrl?: string;
  tPlusDays?: number;
  maxQuota?: number;
  promotionalUnlockDate?: string;
}

export interface BankDetails {
  accountNumber: string;
  bankCode: string;
  bankName: string;
  accountName: string;
}

export interface SystemDepositAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  balance: number;
  referralCode: string;
  referredBy?: string;
  referralEarnings: number;
  withdrawalLimit?: number;
  bankDetails?: BankDetails;
  vipLevelIndex?: number;
  avatar?: string;
  disabled?: boolean;
  createdAt?: string;
  claimedTasks?: string[];
  balanceAlertThreshold?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId?: string;
  text: string;
  timestamp: string;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  transactions: Transaction[];
  investments: Investment[];
  products: Product[];
  commissions: Commission[];
  incomeRecords: IncomeRecord[];
  globalWithdrawalLimit: number;
  managerLink: string;
  groupLink: string;
  systemDepositAccounts: SystemDepositAccount[];
  chatMessages: ChatMessage[];
}

interface AppContextType extends AppState {
  login: (email: string, password?: string) => void;
  logout: () => void;
  sendChatMessage: (text: string, toUserId?: string) => void;
  requestDeposit: (amount: number, reference: string) => void;
  requestWithdrawal: (
    amount: number,
    bankDetails: { bankName: string; accountNumber: string; accountName?: string },
  ) => void;
  createInvestment: (
    planName: string,
    amount: number,
    expectedRoi: number,
    durationDays: number,
    fixedDailyReturn?: number,
    tPlusDays?: number,
    quantity?: number,
  ) => void;
  approveTransaction: (id: string) => void;
  rejectTransaction: (id: string) => void;
  updateRoi: () => void;
  signup: (phone: string, password?: string, referralCode?: string) => void;
  updateGlobalWithdrawalLimit: (limit: number) => void;
  updateUserWithdrawalLimit: (
    userId: string,
    limit: number | undefined,
  ) => void;
  updateContactLinks: (manager: string, group: string) => void;
  disableUser: (userId: string) => void;
  enableUser: (userId: string) => void;
  collectEarnings: (investmentId: string, suppressAlert?: boolean) => void;
  updateBankDetails: (details: BankDetails) => void;
  updateAvatar: (avatarBase64: string) => void;
  updatePhone: (phone: string) => void;
  updatePassword: (password: string) => void;
  updateBalanceAlertThreshold: (threshold: number) => void;
  adminResetUserPassword: (userId: string, newPassword?: string) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  editProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  refreshProducts: () => Promise<Product[] | null>;
  upgradeVip: () => void;
  addBalance: (amount: number) => void;
  claimTask: (taskId: string, reward: number) => void;
  promoImage: string | null;
  setPromoImage: (url: string | null) => void;
  adminUsdtAddress: string | null;
  setAdminUsdtAddress: (val: string | null) => void;
  aboutUsImage: string | null;
  setAboutUsImage: (url: string) => void;
  announcement: string | null;
  setAnnouncement: (text: string | null) => void;
  carouselImages: string[];
  addCarouselImage: (url: string) => void;
  removeCarouselImage: (index: number) => void;
  addSystemDepositAccount: (account: Omit<SystemDepositAccount, "id">) => void;
  editSystemDepositAccount: (id: string, account: Partial<SystemDepositAccount>) => void;
  deleteSystemDepositAccount: (id: string) => void;
}

const defaultUsers: User[] = [
  {
    id: "u1",
    name: "Demo User",
    email: "user@iconic.com",
    phone: "1234567890",
    password: "password123",
    role: "user",
    balance: 5000000,
    referralCode: "893475",
    referralEarnings: 0,
    vipLevelIndex: 0,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "a1",
    name: "Admin",
    email: "doriangrey0366@gmail.com",
    password: "882036",
    role: "admin",
    balance: 0,
    referralCode: "ADMINX",
    referralEarnings: 0,
    vipLevelIndex: 0,
    createdAt: new Date(Date.now() - 86400000 * 100).toISOString(),
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('app_currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [globalWithdrawalLimit, setGlobalWithdrawalLimit] = useState<number>(5000000);
  const [managerLink, setManagerLink] = useState<string>("https://t.me/manager");
  const [groupLink, setGroupLink] = useState<string>("https://t.me/group");
  const [systemDepositAccounts, setSystemDepositAccounts] = useState<SystemDepositAccount[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem("chatMessages");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const sendChatMessage = async (text: string, toUserId?: string) => {
    if (!currentUser) return;
    
    // Fallback if crypto.randomUUID is not available
    let randomId = "";
    try { 
      randomId = crypto.randomUUID(); 
    } catch (e) { 
      try {
        randomId = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
          (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
      } catch (err) {
        randomId = 'user-msg-' + Date.now().toString(36) + Math.random().toString(36).slice(2);
      }
    }

    const newMessage: ChatMessage = {
      id: randomId,
      senderId: currentUser.id,
      receiverId: toUserId || null,
      text,
      timestamp: new Date().toISOString()
    };
    
    // Optimistic UI update
    setChatMessages((prev) => {
      const updated = [...prev, newMessage];
      localStorage.setItem("chatMessages", JSON.stringify(updated));
      return updated;
    });

    // Save to db
    const { error } = await supabase.from("chat_messages").insert([{
      id: newMessage.id,
      senderId: newMessage.senderId,
      receiverId: newMessage.receiverId,
      text: newMessage.text,
      timestamp: newMessage.timestamp
    }]);
    if (error) {
      console.error("Error inserting chat message:", error);
      alert("Error sending message: " + error.message);
    }
  };

  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [adminUsdtAddress, setAdminUsdtAddress] = useState<string | null>(null);
  const [promoImage, setPromoImage] = useState<string | null>(null);
  const [aboutUsImage, setAboutUsImage] = useState<string | null>(null);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  const [isLoadingStore, setIsLoadingStore] = useState(true);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "chatMessages" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setChatMessages(parsed);
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: usersData },
          { data: txData },
          { data: invData },
          { data: prodData },
          { data: commData },
          { data: incData },
          { data: sysData },
          { data: settingsData },
          { data: chatData }
        ] = await Promise.all([
          supabase.from("users").select("*"),
          supabase.from("transactions").select("*"),
          supabase.from("investments").select("*"),
          supabase.from("products").select("*"),
          supabase.from("commissions").select("*"),
          supabase.from("incomeRecords").select("*"),
          supabase.from("system_deposit_accounts").select("*"),
          supabase.from("app_settings").select("*").single(),
          supabase.from("chat_messages").select("*").order("timestamp", { ascending: true })
        ]);

        if (usersData) {
          setUsers(usersData);
          setCurrentUser(prevUser => {
            if (!prevUser) return null;
            const updated = usersData.find(u => u.id === prevUser.id);
            return updated || prevUser;
          });
        }
        if (txData) setTransactions(txData);
        if (invData) setInvestments(invData);
        if (prodData) setProducts(prodData);
        if (commData) setCommissions(commData);
        if (incData) setIncomeRecords(incData);
        if (sysData) setSystemDepositAccounts(sysData);
        if (chatData) {
          setChatMessages(chatData);
          localStorage.setItem("chatMessages", JSON.stringify(chatData));
        }

        if (settingsData) {
          setGlobalWithdrawalLimit(settingsData.globalWithdrawalLimit ?? 5000000);
          setManagerLink(settingsData.managerLink || "https://t.me/manager");
          setGroupLink(settingsData.groupLink || "https://t.me/group");
          setAnnouncement(settingsData.announcement || null);
          setAdminUsdtAddress(settingsData.adminUsdtAddress || null);
          setPromoImage(settingsData.promoImage || null);
          setAboutUsImage(settingsData.aboutUsImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Equinor_logo.svg/1024px-Equinor_logo.svg.png");
          setCarouselImages(settingsData.carouselImages || [
             "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
             "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800"
          ]);
        }
        
      } catch (err) {
        console.error("Error fetching from supabase:", err);
      } finally {
        setIsLoadingStore(false);
      }
    };
    
    setIsLoadingStore(true);
    fetchData();

    // Poll every 15 seconds to keep devices in sync
    const interval = setInterval(() => {
      fetchData();
    }, 15000);

    const subscription = supabase
      .channel('chat_messages_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        setChatMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          const updated = [...prev, payload.new as ChatMessage];
          localStorage.setItem("chatMessages", JSON.stringify(updated));
          return updated;
        });
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('app_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('app_currentUser');
    }
  }, [currentUser]);

  const addProduct = async (product: Omit<Product, "id">) => {
    const { data, error } = await supabase.from('products').insert(product).select().single();
    if (!error && data) {
       setProducts((prev) => [...prev, data]);
    }
  };

  const editProduct = async (id: string, product: Partial<Product>) => {
    const { error } = await supabase.from('products').update(product).eq('id', id);
    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...product } : p))
      );
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const refreshProducts = async () => {
    const { data } = await supabase.from('products').select('*');
    if (data) {
      setProducts(data);
      return data;
    }
    return null;
  };

  useEffect(() => {
    const checkExpiringInvestments = () => {
      setInvestments((prevInvestments) => {
        let hasChanges = false;
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;

        const updatedInvestments = prevInvestments.map(inv => {
          if (inv.status === "active" && !inv.expiryNotified) {
            const endMs = new Date(inv.endDate).getTime();
            // If the investment expires in less than 24 hours
            if (endMs - now <= oneDayMs && endMs > now) {
              const user = users.find(u => u.id === inv.userId);
              const email = user?.email || user?.phone || "user@example.com";
              console.log(`[MOCK EMAIL] To: ${email}\nSubject: Your investment is expiring soon!\nBody: Hello, your investment in ${inv.planName} is nearing its expiry date (${new Date(endMs).toLocaleString()}). Please remember to collect your profits.`);
              hasChanges = true;
              return { ...inv, expiryNotified: true };
            }
          }
          return inv;
        });

        return hasChanges ? updatedInvestments : prevInvestments;
      });
    };

    // Check immediately on mount, then every 1 minute
    checkExpiringInvestments();
    const interval = setInterval(checkExpiringInvestments, 60000);
    return () => clearInterval(interval);
  }, [users]);

  const addCarouselImage = (url: string) => {
    setCarouselImages((prev) => [...prev, url]);
  };

  const removeCarouselImage = (index: number) => {
    setCarouselImages((prev) => prev.filter((_, i) => i !== index));
  };

  const login = async (identifier: string, password?: string) => {
    let user = users.find((u) => u.phone === identifier || u.email === identifier);
    
    // Fallback: try fetching from Supabase if not found locally
    if (!user) {
       const isEmail = identifier.includes('@');
       const { data, error } = await supabase.from('users').select('*').eq(isEmail ? 'email' : 'phone', identifier).single();
       if (data) {
         user = data;
         setUsers(prev => [...prev, data]);
       }
    }

    if (!user) {
      alert("User not found.");
      return;
    }
    if (user.disabled) {
      alert("Your account has been disabled. Please contact support.");
      return;
    }
    if (user.password !== password) {
      alert("Incorrect password.");
      return;
    }
    setCurrentUser(user);
    window.location.hash = '';
  };

  const signup = async (identifier: string, password?: string, referralCode?: string) => {
    if (!referralCode || referralCode.trim() === '') {
      alert("Please enter the invitation code.");
      return;
    }
    if (identifier.includes('@')) {
      alert("Registration via email is no longer supported. Please enter a valid phone number.");
      return;
    }
    if (/[a-zA-Z]/.test(identifier)) {
      alert("Please enter a valid phone number.");
      return;
    }

    if (users.find((u) => u.phone === identifier)) {
      alert("This number already exist, pls use a different number to register");
      return;
    }
    const newUser = {
      name: `User_${identifier.slice(0, 4)}`,
      email: `${identifier}@equinor-dummy.com`,
      phone: identifier,
      password,
      role: "user",
      balance: 0,
      referralCode: String(Math.floor(100000 + Math.random() * 900000)),
      referredBy: referralCode || null,
      referralEarnings: 0,
    };
    const { data, error } = await supabase.from('users').insert(newUser).select().single();
    if (data) {
      setUsers((prev) => [...prev, data]);
      setCurrentUser(data);
      window.location.hash = '';
    } else {
      console.error("Signup error:", error);
      alert(`Failed to sign up: ${error?.message || "Unknown error"}`);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    window.location.hash = '#/login';
  };

  const requestDeposit = async (amount: number, reference: string) => {
    if (!currentUser) return;
    const newTx = {
      userId: currentUser.id,
      type: "deposit" as TransactionType,
      amount,
      status: "pending" as TransactionStatus,
      bankDetails: { reference },
    };
    const { data, error } = await supabase.from('transactions').insert(newTx).select().single();
    if (error) {
      console.error(error);
      alert("Failed to submit deposit: " + error.message);
      return;
    }
    if (data) {
      setTransactions((prev) => [data, ...prev]);
    }
  };

  const requestWithdrawal = async (
    amount: number,
    bankDetails: { bankName: string; accountNumber: string; accountName?: string },
  ) => {
    if (!currentUser) return;
    if (amount > currentUser.balance) {
      alert("Insufficient balance");
      return;
    }

    const { error } = await supabase.from('users').update({ balance: currentUser.balance - amount }).eq('id', currentUser.id);
    if (error) {
       alert("Withdrawal failed");
       return;
    }

    // Deduct pending requested withdrawal
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id ? { ...u, balance: u.balance - amount } : u,
      ),
    );
    setCurrentUser((prev) =>
      prev ? { ...prev, balance: prev.balance - amount } : prev,
    );

    const newTx = {
      userId: currentUser.id,
      type: "withdrawal" as TransactionType,
      amount,
      status: "pending" as TransactionStatus,
      bankDetails,
    };
    const { data } = await supabase.from('transactions').insert(newTx).select().single();
    if (data) setTransactions((prev) => [data, ...prev]);
    alert("Withdrawal request submitted and is pending admin approval.");
  };

  const createInvestment = async (
    planName: string,
    amount: number,
    expectedRoi: number,
    durationDays: number,
    fixedDailyReturn?: number,
    tPlusDays?: number,
    quantity?: number,
  ) => {
    if (!currentUser) return;
    
    if (amount > currentUser.balance) {
      alert("Insufficient balance for investment.");
      return;
    }

    const { error: balanceError } = await supabase.from('users').update({ balance: currentUser.balance - amount }).eq('id', currentUser.id);
    if (balanceError) {
      alert("Investment failed");
      return;
    }

    setUsers((prev) => {
      let updatedUsers = [...prev];
      const buyerIndex = updatedUsers.findIndex((u) => u.id === currentUser.id);
      if (buyerIndex !== -1) {
        updatedUsers[buyerIndex] = {
          ...updatedUsers[buyerIndex],
          balance: updatedUsers[buyerIndex].balance - amount
        };
        
        // Distribute commission
        const buyer = updatedUsers[buyerIndex];
        if (buyer.referredBy) {
          const rates = [0.10, 0.01, 0.01]; // 10%, 1%, 1%
          let currentBuyer = buyer;
          const newCommissionsHere: Commission[] = [];
          
          for (let level = 0; level < 3; level++) {
            if (!currentBuyer.referredBy) break;
            const referrerIndex = updatedUsers.findIndex(u => u.referralCode === currentBuyer.referredBy);
            if (referrerIndex === -1) break;
            
            const referrer = updatedUsers[referrerIndex];
            const commissionAmount = amount * rates[level];
            
            updatedUsers[referrerIndex] = {
              ...referrer,
              balance: referrer.balance + commissionAmount,
              referralEarnings: referrer.referralEarnings + commissionAmount
            };
            
            supabase.from('users').update({
               balance: referrer.balance + commissionAmount,
               referralEarnings: referrer.referralEarnings + commissionAmount
            }).eq('id', referrer.id).then();
            
            newCommissionsHere.push({
              id: Math.random().toString(36).substr(2, 9),
              userId: referrer.id,
              fromUserId: buyer.id,
              amount: commissionAmount,
              date: new Date().toISOString(),
              level: level + 1,
              type: "investment"
            });
            
            supabase.from('commissions').insert({
              userId: referrer.id,
              fromUserId: buyer.id,
              amount: commissionAmount,
              level: level + 1,
              type: "investment"
            }).then();
            
            currentBuyer = referrer;
          }
          
          if (newCommissionsHere.length > 0) {
            setCommissions(prevCommissions => [...newCommissionsHere, ...prevCommissions]);
          }
        }
      }
      return updatedUsers;
    });

    setCurrentUser((prev) =>
      prev ? { ...prev, balance: prev.balance - amount } : prev,
    );

    const inv = {
      userId: currentUser.id,
      planName,
      amount,
      expectedRoi,
      fixedDailyReturn,
      tPlusDays: tPlusDays || 1,
      quantity: quantity || 1,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * durationDays).toISOString(),
      status: "active" as const,
    };
    
    const { data: invData } = await supabase.from('investments').insert(inv).select().single();
    if (invData) setInvestments((prev) => [invData, ...prev]);
    alert("Purchase successful!");
  };

  const approveTransaction = async (id: string) => {
    try {
      console.log("Approving transaction with ID:", id);
      const tx = transactions.find((t) => t.id === id);
      if (!tx || tx.status !== "pending") {
        alert("Transaction could not be approved because it is no longer pending locally.");
        return;
      }

      // 1. Confirm with the server that it is still pending
      const { data: latestTx, error: latestErr } = await supabase.from('transactions').select('*').eq('id', id).single();
      if (latestErr) throw new Error("Could not fetch latest transaction: " + latestErr.message);
      if (!latestTx || latestTx.status !== 'pending') {
          alert("This transaction has already been processed or does not exist.");
          return;
      }

      // 2. Mark transaction as approved
      const { error: txErr } = await supabase.from('transactions').update({ status: 'approved' }).eq('id', id);
      if (txErr) throw new Error("Could not update transaction: " + txErr.message);

      // 3. Fetch fresh user data from DB
      const { data: userLoc, error: ulErr } = await supabase.from('users').select('*').eq('id', tx.userId).single();
      if (ulErr || !userLoc) {
         throw new Error("User not found in database for ID: " + tx.userId);
      }

      if (tx.type === "deposit") {
        const newBalance = Number(userLoc.balance || 0) + Number(tx.amount || 0);
        console.log(`Updating balance to ${newBalance} for user ${userLoc.id}`);
        const { error: uErr } = await supabase.from('users').update({ balance: newBalance }).eq('id', userLoc.id);
        if (uErr) throw new Error("Could not update user balance: " + uErr.message);

        // Process commissions sequentially
        if (userLoc.referredBy) {
          const rates = [0.10, 0.01, 0.01];
          let currentBuyer = userLoc;
          
          for (let level = 0; level < 3; level++) {
            if (!currentBuyer.referredBy) break;
            const { data: refUsers } = await supabase.from('users').select('*').eq('referralCode', currentBuyer.referredBy);
            const referrerLoc = refUsers?.[0];
            if (!referrerLoc) break;
            
            const commissionAmount = Number(tx.amount) * rates[level];
            const newRefBalance = Number(referrerLoc.balance || 0) + commissionAmount;
            const newRefEarnings = Number(referrerLoc.referralEarnings || 0) + commissionAmount;

            await supabase.from('users').update({
              balance: newRefBalance,
              referralEarnings: newRefEarnings
            }).eq('id', referrerLoc.id);

            const comm: Omit<Commission, "id"> = {
              userId: referrerLoc.id,
              fromUserId: userLoc.id,
              amount: commissionAmount,
              date: new Date().toISOString(),
              level: level + 1,
              type: "deposit" as const
            };

            await supabase.from('commissions').insert(comm);
            currentBuyer = referrerLoc;
          }
        }
      }

      // Fetch full state again to stay in sync
      const { data: txData } = await supabase.from("transactions").select("*");
      if (txData) setTransactions(txData);
      
      const { data: usersData } = await supabase.from("users").select("*");
      if (usersData) {
        setUsers(usersData);
        setCurrentUser(prev => usersData.find(u => u.id === prev?.id) || prev);
      }
      
      const { data: commData } = await supabase.from("commissions").select("*");
      if (commData) setCommissions(commData);

      alert("Transaction approved successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Approval failed: " + err.message);
    }
  };

  const rejectTransaction = async (id: string) => {
    try {
      console.log("Rejecting transaction:", id);
      const tx = transactions.find((t) => t.id === id);
      if (!tx || tx.status !== "pending") {
         alert("Transaction could not be rejected because it is no longer pending locally.");
         return;
      }

      const { data: latestTx, error: latestErr } = await supabase.from('transactions').select('*').eq('id', id).single();
      if (latestErr) throw new Error("Could not fetch latest transaction: " + latestErr.message);
      if (!latestTx || latestTx.status !== 'pending') {
          alert("This transaction has already been processed or does not exist.");
          return;
      }

      const { error: txErr } = await supabase.from('transactions').update({ status: 'rejected' }).eq('id', id);
      if (txErr) throw new Error("Could not update transaction: " + txErr.message);

      if (tx.type === "withdrawal") {
        // Refund the balance in Supabase
        const { data: userLoc, error: ulErr } = await supabase.from('users').select('*').eq('id', tx.userId).single();
        if (ulErr || !userLoc) {
           throw new Error("User not found in database for ID: " + tx.userId);
        }
        
        const newBalance = Number(userLoc.balance || 0) + Number(tx.amount || 0);
        const { error: userErr } = await supabase.from('users').update({ balance: newBalance }).eq('id', userLoc.id);
        if (userErr) throw new Error("Could not refund user balance: " + userErr.message);
      }

      // Fetch full state again to stay in sync
      const { data: txData } = await supabase.from("transactions").select("*");
      if (txData) setTransactions(txData);
      
      const { data: usersData } = await supabase.from("users").select("*");
      if (usersData) {
        setUsers(usersData);
        setCurrentUser(prev => usersData.find(u => u.id === prev?.id) || prev);
      }

      alert("Transaction rejected successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Reject failed: " + err.message);
    }
  };

  const updateRoi = () => {
    // In a real app this would happen daily via cron job. Here we just trigger it manually or on mount.
    // For prototype we'll just simulate a tiny ROI bump.
  };

  const updateSetting = async (field: string, value: any) => {
    await supabase.from('app_settings').update({ [field]: value }).eq('id', 1);
  };

  const updateGlobalWithdrawalLimit = (limit: number) => {
    setGlobalWithdrawalLimit(limit);
    updateSetting('globalWithdrawalLimit', limit);
  };

  const updateContactLinks = (manager: string, group: string) => {
    setManagerLink(manager);
    setGroupLink(group);
    updateSetting('managerLink', manager);
    updateSetting('groupLink', group);
  };

  const updateUserWithdrawalLimit = (
    userId: string,
    limit: number | undefined,
  ) => {
    setUsers((users) =>
      users.map((u) =>
        u.id === userId ? { ...u, withdrawalLimit: limit } : u,
      ),
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev ? { ...prev, withdrawalLimit: limit } : prev,
      );
    }
  };

  const disableUser = (userId: string) => {
    setUsers((users) =>
      users.map((u) =>
        u.id === userId ? { ...u, disabled: true } : u,
      ),
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev ? { ...prev, disabled: true } : prev,
      );
    }
  };

  const enableUser = (userId: string) => {
    setUsers((users) =>
      users.map((u) =>
        u.id === userId ? { ...u, disabled: false } : u,
      ),
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev ? { ...prev, disabled: false } : prev,
      );
    }
  };

  const collectEarnings = async (investmentId: string, suppressAlert: boolean = false) => {
    if (!currentUser) return;
    const investment = investments.find((inv) => inv.id === investmentId);
    if (
      !investment ||
      investment.userId !== currentUser.id ||
      investment.status !== "active"
    )
      return;

    const now = new Date();
    const startDate = new Date(investment.startDate);
    const endDate = new Date(investment.endDate);
    const lastCollected = investment.lastCollectedDate ? new Date(investment.lastCollectedDate) : startDate;
    
    const msInADay = 1000 * 3600 * 24;
    const tPlusDays = investment.tPlusDays || 1;
    const msInCycle = msInADay * tPlusDays;
    
    const currentElapsedMs = Math.max(0, now.getTime() - lastCollected.getTime());
    const maxAllowedElapsed = Math.min(msInCycle, currentElapsedMs);
    const timeToCollectMs = Math.min(maxAllowedElapsed, endDate.getTime() - lastCollected.getTime());
    
    if (timeToCollectMs < 1000) {
      if (!suppressAlert) alert("No profit available to collect right now.");
      return;
    }
    
    const dailyIncome = getDailyIncome(investment, currentUser, users, investments);

    const profitToCollect = (timeToCollectMs / msInADay) * dailyIncome;

    const newLastCollected = new Date(lastCollected.getTime() + timeToCollectMs);
    const isFinished = newLastCollected.getTime() >= endDate.getTime();
    
    const newStatus = isFinished ? ("completed" as const) : ("active" as const);
    const newDateStr = newLastCollected.toISOString();
    const totalToAdd = profitToCollect + (isFinished ? investment.amount : 0);

    // Update investment status
    setInvestments((prev) =>
      prev.map((inv) =>
        inv.id === investmentId
          ? { ...inv, status: newStatus, lastCollectedDate: newDateStr }
          : inv,
      ),
    );

    // Add to user balance
    setUsers((usersList) =>
      usersList.map((u) =>
        u.id === currentUser.id
          ? { ...u, balance: u.balance + totalToAdd }
          : u,
      ),
    );
    setCurrentUser((prev) =>
      prev ? { ...prev, balance: prev.balance + totalToAdd } : prev,
    );

    if (totalToAdd > 0) {
      setIncomeRecords(prev => [{
        id: Math.random().toString(36).substring(2, 9),
        userId: currentUser.id,
        investmentId: investment.id,
        planName: investment.planName,
        amount: totalToAdd,
        date: now.toISOString(),
      }, ...prev]);
    }

    // Attempt to persist to Supabase
    try {
      await supabase.from('investments').update({
        status: newStatus,
        lastCollectedDate: newDateStr
      }).eq('id', investment.id);

      const { data: userData } = await supabase.from('users').select('*').eq('id', currentUser.id).single();
      const updatedBalance = Number(userData?.balance || currentUser.balance) + totalToAdd;
      await supabase.from('users').update({ balance: updatedBalance }).eq('id', currentUser.id);

      if (totalToAdd > 0) {
        await supabase.from('incomeRecords').insert({
          userId: currentUser.id,
          investmentId: investment.id,
          planName: investment.planName,
          amount: totalToAdd,
          date: now.toISOString()
        });
      }
    } catch (err) {
      console.error(err);
    }

    if (isFinished && currentUser.email) {
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: currentUser.email,
          type: "investment_maturity",
          data: { profit: totalToAdd }
        })
      }).catch(console.error);
    }

    if (totalToAdd > 0 && !suppressAlert) {
      alert(`Collection successful! Added ₦${totalToAdd.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} to your balance.`);
    }
  };

  const updateBankDetails = (details: BankDetails) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, bankDetails: details } : u))
    );
    setCurrentUser((prev) =>
      prev ? { ...prev, bankDetails: details } : prev
    );
    alert('Bank details updated successfully!');
  };

  const updateAvatar = (avatarBase64: string) => {
    if (!currentUser) return;
    localStorage.setItem('userAvatar', avatarBase64);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, avatar: avatarBase64 } : u))
    );
    setCurrentUser((prev) =>
      prev ? { ...prev, avatar: avatarBase64 } : prev
    );
  };

  const updatePhone = (phone: string) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, phone } : u))
    );
    setCurrentUser((prev) =>
      prev ? { ...prev, phone } : prev
    );
  };

  const updatePassword = (password: string) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, password } : u))
    );
    setCurrentUser((prev) =>
      prev ? { ...prev, password } : prev
    );
  };

  const updateBalanceAlertThreshold = (threshold: number) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, balanceAlertThreshold: threshold } : u))
    );
    setCurrentUser((prev) =>
      prev ? { ...prev, balanceAlertThreshold: threshold } : prev
    );
  };

  const adminResetUserPassword = (userId: string, newPassword?: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          if (newPassword === undefined || newPassword === "") {
             const { password, ...rest } = u;
             return rest as User;
          }
          return { ...u, password: newPassword };
        }
        return u;
      })
    );
  };

  const upgradeVip = () => {
    if (!currentUser) return;
    
    const newVipLevel = (currentUser.vipLevelIndex || 0) + 1;
    const referer = users.find(u => u.referralCode === currentUser.referredBy);
    const bonus = newVipLevel * 50000;

    if (referer) {
      const newCommission: Commission = {
        id: Math.random().toString(36).substr(2, 9),
        userId: referer.id,
        fromUserId: currentUser.id,
        amount: bonus,
        date: new Date().toISOString(),
        level: 1,
        type: 'vip_upgrade'
      };
      setCommissions(prev => [...prev, newCommission]);
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) return { ...u, vipLevelIndex: newVipLevel };
        if (referer && u.id === referer.id) return { ...u, balance: u.balance + bonus, referralEarnings: u.referralEarnings + bonus };
        return u;
      })
    );
    
    setCurrentUser((prev) =>
      prev ? { ...prev, vipLevelIndex: newVipLevel } : prev
    );
  };

  const claimTask = async (taskId: string, reward: number) => {
    if (!currentUser) return;
    
    // Check locally first
    const currentTasks = currentUser.claimedTasks || [];
    if (currentTasks.includes(taskId)) return;

    const newBalance = currentUser.balance + reward;
    const newTasks = [...currentTasks, taskId];

    // Optimistic update
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            balance: newBalance,
            claimedTasks: newTasks
          }
        }
        return u;
      })
    );
    setCurrentUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        balance: newBalance,
        claimedTasks: newTasks
      };
    });

    // Save to supabase
    await supabase.from('users').update({ balance: newBalance, claimedTasks: newTasks }).eq('id', currentUser.id);
  };

  const addSystemDepositAccount = async (account: Omit<SystemDepositAccount, "id">) => {
    const { data, error } = await supabase.from('system_deposit_accounts').insert(account).select().single();
    if (data) {
      setSystemDepositAccounts(prev => [...prev, data]);
    }
  };

  const editSystemDepositAccount = async (id: string, account: Partial<SystemDepositAccount>) => {
    const { error } = await supabase.from('system_deposit_accounts').update(account).eq('id', id);
    if (!error) {
      setSystemDepositAccounts(prev => prev.map(a => a.id === id ? { ...a, ...account } : a));
    }
  };

  const deleteSystemDepositAccount = async (id: string) => {
    const { error } = await supabase.from('system_deposit_accounts').delete().eq('id', id);
    if (!error) {
      setSystemDepositAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  const addBalance = (amount: number) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, balance: u.balance + amount } : u))
    );
    setCurrentUser((prev) =>
      prev ? { ...prev, balance: prev.balance + amount } : prev
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        transactions,
        investments,
        products,
        commissions,
        incomeRecords,
        globalWithdrawalLimit,
        managerLink,
        groupLink,
        systemDepositAccounts,
        chatMessages,
        login,
        signup,
        logout,
        requestDeposit,
        requestWithdrawal,
        createInvestment,
        approveTransaction,
        rejectTransaction,
        updateRoi,
        updateGlobalWithdrawalLimit,
        updateUserWithdrawalLimit,
        updateContactLinks,
        disableUser,
        enableUser,
        collectEarnings,
        updateBankDetails,
        updateAvatar,
        updatePhone,
        updatePassword,
        updateBalanceAlertThreshold,
        adminResetUserPassword,
        addProduct,
        editProduct,
        deleteProduct,
        refreshProducts,
        upgradeVip,
        addBalance,
        claimTask,
        addSystemDepositAccount,
        editSystemDepositAccount,
        deleteSystemDepositAccount,
        announcement,
        setAnnouncement,
        adminUsdtAddress,
        setAdminUsdtAddress,
        promoImage,
        setPromoImage,
        aboutUsImage,
        setAboutUsImage,
        carouselImages,
        addCarouselImage,
        removeCarouselImage,
        sendChatMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within AppProvider");
  return context;
};
