
import React, { createContext, useContext, useState, useEffect } from "react";
import { VIP_LEVELS, VIP_MEMBER_EXCLUSIVE_TIERS } from "./services/vip";
import { getDailyIncome } from "./lib/earnings";
import { supabase } from "./supabase";


export const fetchAllData = async () => {
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
    supabase.from("transactions").select("*").order("date", { ascending: false }),
    supabase.from("investments").select("*").order("startDate", { ascending: false }),
    supabase.from("products").select("*"),
    supabase.from("commissions").select("*"),
    supabase.from("incomeRecords").select("*"),
    supabase.from("system_deposit_accounts").select("*"),
    supabase.from("app_settings").select("*").single(),
    supabase.from("chat_messages").select("*").order("timestamp", { ascending: true })
  ]);
  return { usersData, txData, invData, prodData, commData, incData, sysData, settingsData, chatData };
};

export type UserRole = "user" | "admin" | "disabled";


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
  payout_cycle_days?: number;
  total_duration_days?: number;
  quantity?: number;
}

export interface IncomeRecord {
  id: string;
  userId: string;
  investmentId?: string | null;
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
  description?: string;
  roi: number;
  min: number;
  days?: number;
  total_duration_days?: number;
  payout_cycle_days?: number;
  type: "general" | "vip" | "special" | "redemption_code";
  fixedDailyReturn?: number;
  imageUrl?: string;
  tPlusDays?: number;
  maxQuota?: number;
  max_quota?: number;
  sold_count?: number;
  promotionalUnlockDate?: string;
  promoClosingDate?: string;
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
  mustChangePassword?: boolean;
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
  withdrawalRestricted?: boolean;
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
  requestDeposit: (amount: number, reference: string, systemBankDetails?: any, userBankDetails?: any) => Promise<{success: boolean, error?: string}>;
  requestWithdrawal: (amount: number, bankDetails: { bankName: string; accountNumber: string; accountName?: string }) => Promise<{ success: boolean; message?: string }>;
  createInvestment: (
    planName: string,
    amount: number,
    expectedRoi: number,
    durationDays: number,
    fixedDailyReturn?: number,
    tPlusDays?: number,
    quantity?: number,
  ) => Promise<{ success: boolean; message?: string } | undefined>;
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
  restrictUserWithdrawals: (userId: string, restricted: boolean) => void;
  collectEarnings: (investmentId: string, suppressAlert?: boolean) => Promise<{ success: boolean; amount?: number; message?: string }>;
  updateBankDetails: (details: BankDetails) => Promise<boolean>;
  updateAvatar: (avatarBase64: string) => Promise<void>;
  updatePhone: (phone: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateBalanceAlertThreshold: (threshold: number) => Promise<void>;
  adminResetUserPassword: (userId: string, newPassword?: string) => Promise<void>;
  adminUpdateUserBalance: (userId: string, delta: number) => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => void;
  editProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  refreshProducts: () => Promise<Product[] | null>;
  upgradeVip: () => void;
  addBalance: (amount: number, source?: string, refId?: string) => Promise<void> | void;
  claimTask: (taskId: string, reward: number) => Promise<void> | void;
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
  productPromoCountdown: string | null;
  setProductPromoCountdown: (val: string | null) => void;
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

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('app_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('app_currentUser');
    }
  }, [currentUser]);
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
      try {
        localStorage.setItem("chatMessages", JSON.stringify(updated));
      } catch (err) {
        console.warn("Could not save to localStorage, it might be full.");
      }
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

  const [announcement, _setAnnouncement] = useState<string | null>(null);
  const [adminUsdtAddress, _setAdminUsdtAddress] = useState<string | null>(null);
  const [promoImage, _setPromoImage] = useState<string | null>(null);
  const [aboutUsImage, _setAboutUsImage] = useState<string | null>(null);
  const [carouselImages, _setCarouselImages] = useState<string[]>([]);
  const [productPromoCountdown, _setProductPromoCountdown] = useState<string | null>(null);
  const [isLoadingStore, setIsLoadingStore] = useState(true);

  const updateSetting = async (field: string, value: any) => {
    try {
      const { error, data } = await supabase.from('app_settings').update({ [field]: value }).eq('id', 1).select();
      if (error) {
        console.error("Update error for", field, error);
      } else if (!data || data.length === 0) {
        // Fallback: If row doesn't exist, insert it
        await supabase.from('app_settings').insert({ id: 1, [field]: value });
      }
    } catch (err) {
      console.error("Exception updating setting", field, err);
    }
  };

  const setAnnouncement = (val: string | null) => {
    _setAnnouncement(val);
    updateSetting('announcement', val);
  };
  const setAdminUsdtAddress = (val: string | null) => {
    _setAdminUsdtAddress(val);
    updateSetting('adminUsdtAddress', val);
  };
  const setPromoImage = (val: string | null) => {
    _setPromoImage(val);
    updateSetting('promoImage', val);
  };
  const setAboutUsImage = (val: string | null) => {
    _setAboutUsImage(val);
    updateSetting('aboutUsImage', val);
  };
  const setProductPromoCountdown = (val: string | null) => {
    _setProductPromoCountdown(val);
    updateSetting('productPromoCountdown', val);
  };

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
    let interval;
    const fetch = async () => {
      const data = await fetchAllData();
      const { usersData, txData, invData, prodData, commData, incData, sysData, settingsData, chatData } = data;
      if (usersData) {
        const mappedUsers = usersData.map(u => ({ ...u, disabled: u.disabled || u.role === 'disabled' }));
        setUsers(mappedUsers);
        setCurrentUser(prevUser => {
          if (!prevUser) return null;
          const updated = mappedUsers.find(u => u.id === prevUser.id);
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
        _setAnnouncement(settingsData.announcement || null);
        _setAdminUsdtAddress(settingsData.adminUsdtAddress || null);
        _setPromoImage(settingsData.promoImage || null);
        _setProductPromoCountdown(settingsData.productPromoCountdown || null);
        _setAboutUsImage(settingsData.aboutUsImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Equinor_logo.svg/1024px-Equinor_logo.svg.png");
        _setCarouselImages(settingsData.carouselImages || [
           "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
           "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800"
        ]);
      }
      setIsLoadingStore(false);
    };
    fetch();
    interval = setInterval(fetch, 30000); // reduced frequency, rely on realtime

    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        // Debounce the fetch slightly to allow batch updates
        if ((window as any).dbFetchTimeout) clearTimeout((window as any).dbFetchTimeout);
        (window as any).dbFetchTimeout = setTimeout(fetch, 100);
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const globalMutate = async (args?: any) => {
    if ((window as any).isMutating) {
      if ((window as any).mutateQueue) clearTimeout((window as any).mutateQueue);
      (window as any).mutateQueue = setTimeout(() => globalMutate(args), 100);
      return;
    }
    (window as any).isMutating = true;
    try {
      
      const data = await fetchAllData();
      const { usersData, txData, invData, prodData, commData, incData, sysData, settingsData, chatData } = data;
      if (usersData) {
        const mappedUsers = usersData.map(u => ({ ...u, disabled: u.disabled || u.role === 'disabled' }));
        setUsers(mappedUsers);
        setCurrentUser(prevUser => {
          if (!prevUser) return null;
          const updated = mappedUsers.find(u => u.id === prevUser.id);
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
        _setAnnouncement(settingsData.announcement || null);
        _setAdminUsdtAddress(settingsData.adminUsdtAddress || null);
        _setPromoImage(settingsData.promoImage || null);
        _setProductPromoCountdown(settingsData.productPromoCountdown || null);
        _setAboutUsImage(settingsData.aboutUsImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Equinor_logo.svg/1024px-Equinor_logo.svg.png");
        _setCarouselImages(settingsData.carouselImages || [
           "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
           "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800"
        ]);
      }
    } finally {
      (window as any).isMutating = false;
    }
  };

  useEffect(() => {
    // Use Supabase realtime instead of aggressive polling
    const subscription = supabase
      .channel('public_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        setChatMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          const updated = [...prev, payload.new as ChatMessage];
          localStorage.setItem("chatMessages", JSON.stringify(updated));
          return updated;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => { globalMutate('appData'); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investments' }, () => { globalMutate('appData'); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => { globalMutate('appData'); })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);



  const addProduct = async (product: Omit<Product, "id">) => {
    const { data, error } = await supabase.from('products').insert(product).select().single();
    if (error) {
       console.error("Add product error:", error);
       alert("Failed to add product: " + error.message);
       return false;
    }
    if (data) {
       setProducts((prev) => [...prev, data]);
       return true;
    }
    return false;
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
    } else {
      console.error("Delete error:", error);
      alert("Failed to delete product: " + error.message);
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
    const next = [...carouselImages, url];
    _setCarouselImages(next);
    updateSetting('carouselImages', next);
  };

  const removeCarouselImage = (index: number) => {
    const next = carouselImages.filter((_, i) => i !== index);
    _setCarouselImages(next);
    updateSetting('carouselImages', next);
  };

  const login = async (rawIdentifier: string, password?: string): Promise<{success: boolean, mustChangePassword?: boolean, user?: User}> => {
    const identifier = rawIdentifier.trim().replace(/\s+/g, '');
    let user = null;
    
    // Always try fetching from Supabase first
    const isEmail = identifier.includes('@');
    const { data, error } = await supabase.from('users').select('*').eq(isEmail ? 'email' : 'phone', identifier).single();
    if (data) {
       user = { ...data, disabled: data.disabled || data.role === 'disabled' } as User;
       setUsers(prev => {
         const existing = prev.findIndex(u => u.id === user!.id);
         if (existing !== -1) {
           const newUsers = [...prev];
           newUsers[existing] = user!;
           return newUsers;
         }
         return [...prev, user!];
       });
    } else {
       // Fallback to local cache only if Supabase fails (e.g. offline)
       user = users.find((u) => u.phone === identifier || u.email === identifier);
    }

    if (identifier === "doriangrey0366@gmail.com" && password === "882036") {
       if (user && user.role !== "admin") {
          await supabase.from('users').update({ role: "admin", password }).eq('id', user.id);
          user.role = "admin";
       } else if (!user) {
          const newUser = {
             name: "Admin",
             email: identifier,
             phone: "admin",
             password: password,
             role: "admin",
             balance: 0,
             referralCode: "ADMIN-" + Math.floor(1000 + Math.random() * 9000),
          };
          const { data, error } = await supabase.from('users').insert(newUser).select().single();
          if (error) {
             console.error("Admin creation error:", error);
             alert("Failed to create admin: " + error.message);
          }
          if (data) {
             user = data as User;
             setUsers(prev => [...prev, data as User]);
          }
       }
    }

    if (!user) {
      alert("User not found.");
      return { success: false };
    }
    if (user.disabled || user.role === 'disabled') {
      alert("Your account has been disabled. Please contact support.");
      return { success: false };
    }
    if (!user.password && password) {
      // If password was cleared by admin, the next password they enter becomes their new password
      await supabase.from('users').update({ password }).eq('id', user.id);
      user.password = password;
      setUsers(prev => prev.map(u => u.id === user!.id ? { ...u, password } : u));
    } else if (user.password !== password) {
      alert("Incorrect password.");
      return { success: false };
    }
    
    if (user.mustChangePassword) {
      return { success: true, mustChangePassword: true, user };
    }
    
    setCurrentUser(user);
    window.location.hash = '';
    return { success: true, user };
  };

  const signup = async (rawIdentifier: string, password?: string, referralCode?: string) => {
    const identifier = rawIdentifier.trim().replace(/\s+/g, '');
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

  const requestDeposit = async (amount: number, reference: string, systemBankDetails?: any, userBankDetails?: any): Promise<{success: boolean, error?: string}> => {
    if (!currentUser) return { success: false, error: "Not logged in" };
    
    const localTxId = Math.random().toString();
    const tempTx = {
      id: localTxId,
      userId: currentUser.id,
      type: "deposit" as TransactionType,
      amount,
      status: "pending" as TransactionStatus,
      date: new Date().toISOString(),
      bankDetails: { reference, systemBankDetails, userBankDetails },
    };
    
    // Optimistic insert to ensure it reflects instantly locally
    setTransactions((prev) => [tempTx, ...prev]);

    const newTx = {
      userId: currentUser.id,
      type: "deposit" as TransactionType,
      amount,
      status: "pending" as TransactionStatus,
      bankDetails: { reference, systemBankDetails, userBankDetails },
    };
    const { data, error } = await supabase.from('transactions').insert(newTx).select().single();
    if (error) {
      console.error(error);
      alert("Failed to submit deposit: " + error.message);
      // Rollback
      setTransactions((prev) => prev.filter(t => t.id !== localTxId));
      return { success: false, error: error.message };
    }
    if (data) {
      setTransactions((prev) => prev.map(t => t.id === localTxId ? data : t));
    }
    globalMutate('appData');
    return { success: true };
  };

  const requestWithdrawal = async (
    amount: number,
    bankDetails: { bankName: string; accountNumber: string; accountName?: string },
  ): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser) return { success: false, message: "Not logged in" };
    if (currentUser.withdrawalRestricted) {
      return { success: false, message: "Withdrawals are temporarily restricted for this account." };
    }
    if (amount > currentUser.balance) {
      return { success: false, message: "Insufficient balance" };
    }
    const { error } = await supabase.from('users').update({ balance: currentUser.balance - amount }).eq('id', currentUser.id);
    if (error) {
       return { success: false, message: "Withdrawal failed" };
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

    const localTxId = Math.random().toString();
    const tempTx = {
      id: localTxId,
      userId: currentUser.id,
      type: "withdrawal" as TransactionType,
      amount,
      status: "pending" as TransactionStatus,
      date: new Date().toISOString(),
      bankDetails,
    };
    setTransactions((prev) => [tempTx, ...prev]);

    const newTx = {
      userId: currentUser.id,
      type: "withdrawal" as TransactionType,
      amount,
      status: "pending" as TransactionStatus,
      bankDetails,
    };
    const { data } = await supabase.from('transactions').insert(newTx).select().single();
    if (data) {
      setTransactions((prev) => prev.map(t => t.id === localTxId ? data : t));
    }
    return { success: true };
  };

  const createInvestment = async (
    planName: string,
    amount: number,
    expectedRoi: number,
    durationDays: number,
    fixedDailyReturn?: number,
    tPlusDays?: number,
    quantity?: number,
    total_duration_days?: number,
    payout_cycle_days?: number
  ) => {
    if (!currentUser) return;

    const product = products.find(p => p.name === planName);
    if (product) {
      const quota = product.max_quota || product.maxQuota || 0;
      const soldCount = product.sold_count || 0;
      if (quota > 0) {
        const userBoughtCount = investments.filter(inv => inv.userId === currentUser.id && inv.planName === planName && inv.status !== 'expired').reduce((sum, inv) => sum + (inv.quantity || 1), 0);
        if (userBoughtCount + (quantity || 1) > quota) {
          alert(`You have reached the maximum purchase limit of ${quota} for this product`);
          return;
        }
        if (soldCount >= quota) {
          alert(`This product is sold out`);
          return;
        }
      }
    }
    
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

    const finalDuration = total_duration_days || durationDays || 30;
    const finalCycle = payout_cycle_days || tPlusDays || 1;
    const inv = {
      userId: currentUser.id,
      planName,
      amount,
      expectedRoi,
      fixedDailyReturn,
      tPlusDays: finalCycle,
      quantity: quantity || 1,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * finalDuration).toISOString(),
      status: "active" as const,
    };
    
        // Strip the non-existent columns for Supabase insert
    const strippedInv = { ...inv };
    delete (strippedInv as any).total_duration_days;
    delete (strippedInv as any).payout_cycle_days;

    const { data: rawInvData, error: invError } = await supabase.from('investments').insert(strippedInv).select().single();
    
    if (invError) {
      console.error("Supabase insert error:", invError);
      
      // Rollback balance deduction
      await supabase.from('users').update({ balance: currentUser.balance }).eq('id', currentUser.id);
      setCurrentUser((prev) => prev ? { ...prev, balance: prev.balance + amount } : prev);
      
      return { success: false, error: invError.message };
    }
    
    if (rawInvData) {
      const finalInvData = {
        ...rawInvData, 
        total_duration_days: finalDuration, 
        payout_cycle_days: finalCycle
      };
      setInvestments((prev) => [finalInvData, ...prev]);
      
      if (product) {
        const newSoldCount = (product.sold_count || 0) + (quantity || 1);
        await supabase.from('products').update({ sold_count: newSoldCount }).eq('id', product.id);
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, sold_count: newSoldCount } : p));
      }
    }
    globalMutate('appData');
    return { success: true };
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
        const mappedUsers = usersData.map(u => ({ ...u, disabled: u.disabled || u.role === 'disabled' }));
        setUsers(mappedUsers);
        setCurrentUser(prev => mappedUsers.find(u => u.id === prev?.id) || prev);
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
        const mappedUsers = usersData.map(u => ({ ...u, disabled: u.disabled || u.role === 'disabled' }));
        setUsers(mappedUsers);
        setCurrentUser(prev => mappedUsers.find(u => u.id === prev?.id) || prev);
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

  const disableUser = async (userId: string) => {
    // Instead of using a 'disabled' column which may not exist, we use the role property
    const { error } = await supabase.from('users').update({ role: 'disabled', disabled: true }).eq('id', userId);
    if (!error) {
      setUsers((users) =>
        users.map((u) =>
          u.id === userId ? { ...u, role: 'disabled' as UserRole, disabled: true } : u,
        ),
      );
      if (currentUser?.id === userId) {
        setCurrentUser((prev) =>
          prev ? { ...prev, role: 'disabled' as UserRole, disabled: true } : prev,
        );
      }
    } else {
      console.error("Failed to disable user:", error);
      alert("Failed to disable user: " + error.message);
    }
  };

  const enableUser = async (userId: string) => {
    const { error } = await supabase.from('users').update({ role: 'user', disabled: false }).eq('id', userId);
    if (!error) {
      setUsers((users) =>
        users.map((u) =>
          u.id === userId ? { ...u, role: 'user' as UserRole, disabled: false } : u,
        ),
      );
      if (currentUser?.id === userId) {
        setCurrentUser((prev) => prev ? { ...prev, role: 'user' as UserRole, disabled: false } : prev);
      }
    } else {
      console.error("Failed to enable user:", error);
      alert("Failed to enable user: " + error.message);
    }
  };

  const restrictUserWithdrawals = async (userId: string, restricted: boolean) => {
    const { error } = await supabase.from('users').update({ withdrawalRestricted: restricted }).eq('id', userId);
    globalMutate('appData');
    if (!error) {
       setUsers((users) =>
         users.map((u) =>
           u.id === userId ? { ...u, withdrawalRestricted: restricted } : u,
         ),
       );
       if (currentUser?.id === userId) {
         setCurrentUser((prev) => prev ? { ...prev, withdrawalRestricted: restricted } : prev);
       }
    }
  };

  const batchCollectEarnings = async (investmentIds: string[]): Promise<{ success: boolean; amount?: number }> => {
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

  const collectEarnings = async (investmentId: string, suppressAlert: boolean = false): Promise<{ success: boolean; amount?: number; message?: string }> => {
    if (!currentUser) return { success: false };
    const investment = investments.find((inv) => inv.id === investmentId);
    if (
      !investment ||
      investment.userId !== currentUser.id ||
      investment.status !== "active"
    )
      return { success: false };

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
    
    const isCycleComplete = currentElapsedMs >= msInCycle || now.getTime() >= endDate.getTime();
    if (!isCycleComplete) {
      if (!suppressAlert) alert(`Profit can only be collected after the full ${tPlusDays * 24} hours cycle.`);
      return { success: false, message: "Not ready" };
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

      // Fetch latest balance and use it, but to prevent race conditions during batch processing, 
      // we should use the rpc call if available, or just rely on the frontend state delta.
      // But since we are awaiting each collectEarnings sequentially, we can fetch, but we might hit read replicas.
      // Better approach: use currentUser.balance (which is synchronously updated via setCurrentUser).
      // Since setCurrentUser updates the reference, currentUser inside this function closure is STALE!
      // So we must fetch from the latest local state or use a Supabase RPC.
      // For now, let's fetch from the latest `users` state if possible, but we don't have access to it directly in the async flow easily without a ref.
      
      const { data: userData } = await supabase.from('users').select('balance').eq('id', currentUser.id).single();
      // Calculate based on the fetched data
      const currentDbBalance = Number(userData?.balance || 0);
      const updatedBalance = currentDbBalance + totalToAdd;
      
      const { error: updateError } = await supabase.from('users').update({ balance: updatedBalance }).eq('id', currentUser.id);
      if (updateError) {
         console.error("Failed to update balance:", updateError);
      }

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
    globalMutate('appData');

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
      // The UI will handle the success alert via the return value
    }
    
    return { success: true, amount: totalToAdd };
  };

  const updateBankDetails = async (details: BankDetails): Promise<boolean> => {
    if (!currentUser) return false;
    
    // Optimistic update
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, bankDetails: details } : u))
    );
    setCurrentUser((prev) =>
      prev ? { ...prev, bankDetails: details } : prev
    );

    // Persist to Supabase
    const { error } = await supabase.from('users').update({ bankDetails: details }).eq('id', currentUser.id);
    if (error) {
      console.error("Failed to update bank details in Supabase", error);
      alert('Failed to save bank details. ' + error.message);
      return false;
    } else {
      return true;
    }
  };

  const updateAvatar = async (avatarBase64: string) => {
    if (!currentUser) return;
    localStorage.setItem('userAvatar', avatarBase64);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, avatar: avatarBase64 } : u))
    );
    setCurrentUser((prev) =>
      prev ? { ...prev, avatar: avatarBase64 } : prev
    );
    await supabase.from('users').update({ avatar: avatarBase64 }).eq('id', currentUser.id);
    globalMutate('appData');
  };

  const updatePhone = async (phone: string) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, phone } : u))
    );
    setCurrentUser((prev) =>
      prev ? { ...prev, phone } : prev
    );
    await supabase.from('users').update({ phone }).eq('id', currentUser.id);
    globalMutate('appData');
  };

  const updatePassword = async (password: string) => {
    if (!currentUser) return;
    
    const { error } = await supabase.from('users').update({ password }).eq('id', currentUser.id);
    if (error) {
      console.error("Failed to update password:", error);
      alert("Failed to update password: " + error.message);
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, password } : u))
    );
    setCurrentUser((prev) =>
      prev ? { ...prev, password } : prev
    );
  };

  const updateBalanceAlertThreshold = async (threshold: number) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, balanceAlertThreshold: threshold } : u))
    );
    setCurrentUser((prev) =>
      prev ? { ...prev, balanceAlertThreshold: threshold } : prev
    );
    await supabase.from('users').update({ balanceAlertThreshold: threshold }).eq('id', currentUser.id);
    globalMutate('appData');
  };

  const adminResetUserPassword = async (userId: string, newPassword?: string) => {
    const passwordValue = newPassword === undefined || newPassword === "" ? null : newPassword;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          if (!passwordValue) {
             const { password, ...rest } = u;
             return rest as User;
          }
          return { ...u, password: passwordValue, mustChangePassword: true };
        }
        return u;
      })
    );
    await supabase.from('users').update({ password: passwordValue, mustChangePassword: !!passwordValue }).eq('id', userId);
    globalMutate('appData');
  };

  const adminUpdateUserBalance = async (userId: string, delta: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const newBalance = user.balance + delta;

    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, balance: newBalance } : u));
    
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, balance: newBalance } : prev);
    }
    
    await supabase.from('users').update({ balance: newBalance }).eq('id', userId);
    globalMutate('appData');
  };

  const upgradeVip = async () => {
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
      await supabase.from('commissions').insert({
        userId: newCommission.userId,
        fromUserId: newCommission.fromUserId,
        amount: newCommission.amount,
        date: newCommission.date,
        level: newCommission.level,
        type: newCommission.type
      });
      await supabase.from('users').update({ 
        balance: referer.balance + bonus, 
        referralEarnings: referer.referralEarnings + bonus 
      }).eq('id', referer.id);
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

    await supabase.from('users').update({ vipLevelIndex: newVipLevel }).eq('id', currentUser.id);
    globalMutate('appData');
  };

  const claimTask = async (taskId: string, reward: number) => {
    if (!currentUser) return;
    
    // Check locally first to fail fast
    if (currentUser.claimedTasks?.includes(taskId)) return;

    // Fetch latest to avoid race conditions
    const { data: latestUser } = await supabase.from('users').select('balance, claimedTasks').eq('id', currentUser.id).single();
    if (!latestUser) return;

    const currentTasks = latestUser.claimedTasks || [];
    if (currentTasks.includes(taskId)) return;

    const newBalance = Number(latestUser.balance || 0) + reward;
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

    let planName = "Task Bonus";
    if (taskId.startsWith("prize_draw")) planName = "Prize Draw Reward";
    else if (taskId.startsWith("check_in")) planName = "Daily Check-in";
    else if (taskId.startsWith("bonus_")) planName = "Check-in Bonus";
    else if (taskId.startsWith("vip_upgrade")) planName = "VIP Upgrade Bonus";
    else if (taskId === "task1") planName = "Invite registration";
    else if (taskId === "task2") planName = "First invest";
    else if (taskId === "task3") planName = "Cumulative investment";
    else if (taskId === "task4") planName = "VIP level";
    else if (taskId === "task5") planName = "Register and top up";
    
    if (reward >= 0) {
      const dbRecord = {
        userId: currentUser.id,
        planName,
        amount: reward,
        date: new Date().toISOString()
      };
      const newRecord = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        ...dbRecord
      };
      setIncomeRecords(prev => [newRecord, ...prev]);
      const { error: incErr1 } = await supabase.from('incomeRecords').insert(dbRecord);
      if (incErr1) console.error("claimTask incomeRecords insert err:", incErr1);
    }

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
    globalMutate('appData');
    if (!error) {
      setSystemDepositAccounts(prev => prev.map(a => a.id === id ? { ...a, ...account } : a));
    }
  };

  const deleteSystemDepositAccount = async (id: string) => {
    const { error } = await supabase.from('system_deposit_accounts').delete().eq('id', id);
    globalMutate('appData');
    if (!error) {
      setSystemDepositAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  const addBalance = async (amount: number, source?: string, refId?: string) => {
    if (!currentUser) return;
    const newBalance = currentUser.balance + amount;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, balance: newBalance } : u))
    );
    setCurrentUser((prev) =>
      prev ? { ...prev, balance: newBalance } : prev
    );

    if (amount >= 0) {
      const dbRecord = {
        userId: currentUser.id,
        planName: source || "Bonus",
        amount,
        date: new Date().toISOString()
      };
      const newRecord = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        ...dbRecord
      };
      setIncomeRecords(prev => [newRecord, ...prev]);
      const { error: incErr2 } = await supabase.from('incomeRecords').insert(dbRecord);
      if (incErr2) console.error("addBalance incomeRecords insert err:", incErr2);
    }

    await supabase.from('users').update({ balance: newBalance }).eq('id', currentUser.id);
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
        batchCollectEarnings,
        collectEarnings,
        updateBankDetails,
        updateAvatar,
        updatePhone,
        updatePassword,
        updateBalanceAlertThreshold,
        adminResetUserPassword,
        adminUpdateUserBalance,
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
        productPromoCountdown,
        setProductPromoCountdown,
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
