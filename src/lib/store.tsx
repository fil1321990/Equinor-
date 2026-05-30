import React, { createContext, useContext, useState, useEffect } from "react";
import { VIP_LEVELS, VIP_MEMBER_EXCLUSIVE_TIERS } from "./vip";
import { getDailyIncome } from "./earnings";

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
    bankName: string;
    accountNumber: string;
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
  type: "general" | "vip" | "special";
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
}

interface AppContextType extends AppState {
  login: (email: string, password?: string) => void;
  logout: () => void;
  requestDeposit: (amount: number) => void;
  requestWithdrawal: (
    amount: number,
    bankDetails: { bankName: string; accountNumber: string },
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
  adminResetUserPassword: (userId: string, newPassword?: string) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  editProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  upgradeVip: () => void;
  addBalance: (amount: number) => void;
  claimTask: (taskId: string, reward: number) => void;
  promoImage: string | null;
  setPromoImage: (url: string | null) => void;
  adminWhatsApp: string | null;
  setAdminWhatsApp: (val: string | null) => void;
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
    password: "1321990",
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
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      return { ...defaultUsers[0], avatar: savedAvatar };
    }
    return defaultUsers[0];
  });
  const [globalWithdrawalLimit, setGlobalWithdrawalLimit] =
    useState<number>(5000000);
  const [managerLink, setManagerLink] = useState<string>("https://t.me/manager");
  const [groupLink, setGroupLink] = useState<string>("https://t.me/group");
  const [systemDepositAccounts, setSystemDepositAccounts] = useState<SystemDepositAccount[]>(() => {
    const saved = localStorage.getItem('app_system_deposit_accounts');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
      { id: "sda1", bankName: "Opay", accountName: "Equinor Global", accountNumber: "1234567890" }
    ];
  });
  
  useEffect(() => {
    localStorage.setItem('app_system_deposit_accounts', JSON.stringify(systemDepositAccounts));
  }, [systemDepositAccounts]);
  const [users, setUsers] = useState<User[]>(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      const newUsers = [...defaultUsers];
      newUsers[0] = { ...newUsers[0], avatar: savedAvatar };
      return newUsers;
    }
    return defaultUsers;
  });
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "t1",
      userId: "u1",
      type: "deposit",
      amount: 10000000,
      status: "approved",
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('app_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: "p1", name: "Starter VIP", title: "EQUINOR", roi: 12, min: 20000, days: 30, type: "general" },
      { id: "p2", name: "Basic VIP", title: "EQUINOR", roi: 12, min: 30000, days: 30, type: "general" },
      { id: "p3", name: "Standard VIP", title: "EQUINOR", roi: 12, min: 40000, days: 30, type: "general" },
      { id: "p4", name: "Equinor Equity Exchange Project", title: "EQUINOR", roi: 0, min: 20000, days: 1, type: "vip" },
      { id: "p5", name: "VIP Member Exclusive Project", title: "EQUINOR", roi: 0, min: 0, days: 500, type: "vip", fixedDailyReturn: 1650 },
      { id: "p_vip_team", name: "VIP team exclusive project", title: "EQUINOR", roi: 0, min: 30000, days: 500, type: "vip", fixedDailyReturn: 300 },
      { id: "p6", name: "Platinum VIP", title: "EQUINOR", roi: 12, min: 500000, days: 30, type: "special" },
      { id: "p7", name: "Diamond VIP", title: "EQUINOR", roi: 12, min: 1000000, days: 30, type: "special" },
    ];
  });

  useEffect(() => {
    localStorage.setItem('app_products', JSON.stringify(products));
  }, [products]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([]);

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
    setProducts((prev) => [...prev, newProduct]);
  };

  const editProduct = (id: string, product: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...product } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const [announcement, setAnnouncement] = useState<string | null>(() => {
    return localStorage.getItem('app_announcement') || null;
  });

  const [adminWhatsApp, setAdminWhatsApp] = useState<string | null>(() => {
    return localStorage.getItem('app_adminWhatsApp') || null;
  });

  const [adminUsdtAddress, setAdminUsdtAddress] = useState<string | null>(() => {
    return localStorage.getItem('app_adminUsdtAddress') || null;
  });

  const [promoImage, setPromoImage] = useState<string | null>(() => {
    return localStorage.getItem('app_promoImage') || null;
  });

  const [aboutUsImage, setAboutUsImage] = useState<string | null>(() => {
    return localStorage.getItem('app_aboutUsImage') || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Equinor_logo.svg/1024px-Equinor_logo.svg.png";
  });

  useEffect(() => {
    if (announcement) {
      localStorage.setItem('app_announcement', announcement);
    } else {
      localStorage.removeItem('app_announcement');
    }
  }, [announcement]);

  useEffect(() => {
    if (adminWhatsApp) {
      localStorage.setItem('app_adminWhatsApp', adminWhatsApp);
    } else {
      localStorage.removeItem('app_adminWhatsApp');
    }
  }, [adminWhatsApp]);

  useEffect(() => {
    if (adminUsdtAddress) {
      localStorage.setItem('app_adminUsdtAddress', adminUsdtAddress);
    } else {
      localStorage.removeItem('app_adminUsdtAddress');
    }
  }, [adminUsdtAddress]);
  const [carouselImages, setCarouselImages] = useState<string[]>(() => {
    const saved = localStorage.getItem('app_carouselImages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800",
    ];
  });

  useEffect(() => {
    if (promoImage) {
      localStorage.setItem('app_promoImage', promoImage);
    } else {
      localStorage.removeItem('app_promoImage');
    }
  }, [promoImage]);

  useEffect(() => {
    if (aboutUsImage) {
      localStorage.setItem('app_aboutUsImage', aboutUsImage);
    } else {
      localStorage.removeItem('app_aboutUsImage');
    }
  }, [aboutUsImage]);

  useEffect(() => {
    localStorage.setItem('app_carouselImages', JSON.stringify(carouselImages));
  }, [carouselImages]);

  // Simulate email notification check for investments nearing expiry (e.g. within 1 day)
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

  const login = (identifier: string, password?: string) => {
    // Normal user login by phone or email
    const user = users.find((u) => u.phone === identifier || u.email === identifier);
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
  };

  const signup = (identifier: string, password?: string, referralCode?: string) => {
    const isEmail = identifier.includes('@');
    if (users.find((u) => u.phone === identifier || u.email === identifier)) {
      alert("User already exists with this email or phone number");
      return;
    }
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: `User_${identifier.slice(0, 4)}`,
      email: isEmail ? identifier : `${identifier}@equinor-dummy.com`,
      phone: isEmail ? undefined : identifier,
      password,
      role: "user",
      balance: 0,
      referralCode: String(Math.floor(100000 + Math.random() * 900000)),
      referredBy: referralCode || undefined,
      referralEarnings: 0,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const logout = () => setCurrentUser(null);

  const requestDeposit = (amount: number) => {
    if (!currentUser) return;
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      type: "deposit",
      amount,
      status: "pending",
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    alert("Deposit request submitted and is pending admin approval.");
  };

  const requestWithdrawal = (
    amount: number,
    bankDetails: { bankName: string; accountNumber: string },
  ) => {
    if (!currentUser) return;
    if (amount > currentUser.balance) {
      alert("Insufficient balance");
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

    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      type: "withdrawal",
      amount,
      status: "pending",
      date: new Date().toISOString(),
      bankDetails,
    };
    setTransactions((prev) => [newTx, ...prev]);
    alert("Withdrawal request submitted and is pending admin approval.");
  };

  const createInvestment = (
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
            
            newCommissionsHere.push({
              id: Math.random().toString(36).substr(2, 9),
              userId: referrer.id,
              fromUserId: buyer.id,
              amount: commissionAmount,
              date: new Date().toISOString(),
              level: level + 1,
              type: "investment"
            });
            
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

    const inv: Investment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      planName,
      amount,
      expectedRoi,
      fixedDailyReturn,
      tPlusDays: tPlusDays || 1,
      quantity: quantity || 1,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * durationDays).toISOString(),
      status: "active",
    };
    setInvestments((prev) => [inv, ...prev]);
    alert("Purchase successful!");
  };

  const approveTransaction = (id: string) => {
    setTransactions((prevTxs) => {
      const tx = prevTxs.find((t) => t.id === id);
      if (!tx || tx.status !== "pending") return prevTxs;

      const user = users.find(u => u.id === tx.userId);

      if (tx.type === "deposit") {
        setUsers((prevUsers) => {
          let updatedUsers = [...prevUsers];
          const depositorIndex = updatedUsers.findIndex((u) => u.id === tx.userId);
          
          if (depositorIndex !== -1) {
            updatedUsers[depositorIndex] = {
              ...updatedUsers[depositorIndex],
              balance: updatedUsers[depositorIndex].balance + tx.amount,
            };
            
            // Distribute commission
            const depositor = updatedUsers[depositorIndex];
            if (depositor.referredBy) {
              const rates = [0.10, 0.01, 0.01]; // L1 = 10%, L2 = 1%, L3 = 1%
              let currentBuyer = depositor;
              const newCommissionsHere: Commission[] = [];
              
              for (let level = 0; level < 3; level++) {
                if (!currentBuyer.referredBy) break;
                const referrerIndex = updatedUsers.findIndex(u => u.referralCode === currentBuyer.referredBy);
                if (referrerIndex === -1) break;
                
                const referrer = updatedUsers[referrerIndex];
                const commissionAmount = tx.amount * rates[level];
                
                updatedUsers[referrerIndex] = {
                  ...referrer,
                  balance: referrer.balance + commissionAmount,
                  referralEarnings: referrer.referralEarnings + commissionAmount
                };
                
                newCommissionsHere.push({
                  id: Math.random().toString(36).substr(2, 9),
                  userId: referrer.id,
                  fromUserId: depositor.id,
                  amount: commissionAmount,
                  date: new Date().toISOString(),
                  level: level + 1,
                  type: "deposit"
                });
                
                currentBuyer = referrer;
              }
              
              if (newCommissionsHere.length > 0) {
                setCommissions(prev => [...newCommissionsHere, ...prev]);
              }
            }
          }
          return updatedUsers;
        });

        if (currentUser?.id === tx.userId) {
          setCurrentUser((prev) =>
            prev ? { ...prev, balance: prev.balance + tx.amount } : prev,
          );
        }

        if (user && user.email) {
          fetch("/api/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: user.email,
              type: "deposit_confirmation",
              data: { amount: tx.amount }
            })
          }).catch(console.error);
        }
      } else if (tx.type === "withdrawal") {
        if (user && user.email) {
          fetch("/api/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: user.email,
              type: "withdrawal_approval",
              data: { amount: tx.amount }
            })
          }).catch(console.error);
        }
      }

      return prevTxs.map((t) =>
        t.id === id ? { ...t, status: "approved" } : t,
      );
    });
  };

  const rejectTransaction = (id: string) => {
    setTransactions((prevTxs) => {
      const tx = prevTxs.find((t) => t.id === id);
      if (!tx || tx.status !== "pending") return prevTxs;

      if (tx.type === "withdrawal") {
        // Refund the balance
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === tx.userId ? { ...u, balance: u.balance + tx.amount } : u,
          ),
        );
        if (currentUser?.id === tx.userId) {
          setCurrentUser((prev) =>
            prev ? { ...prev, balance: prev.balance + tx.amount } : prev,
          );
        }
      }

      return prevTxs.map((t) =>
        t.id === id ? { ...t, status: "rejected" } : t,
      );
    });
  };

  const updateRoi = () => {
    // In a real app this would happen daily via cron job. Here we just trigger it manually or on mount.
    // For prototype we'll just simulate a tiny ROI bump.
  };

  const updateGlobalWithdrawalLimit = (limit: number) => {
    setGlobalWithdrawalLimit(limit);
  };

  const updateContactLinks = (manager: string, group: string) => {
    setManagerLink(manager);
    setGroupLink(group);
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

  const collectEarnings = (investmentId: string, suppressAlert: boolean = false) => {
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
    const cycleLength = Math.round((endDate.getTime() - startDate.getTime()) / msInADay);
    const tPlusDays = investment.tPlusDays || 1;
    const msInCycle = msInADay * tPlusDays;
    
    const maxElapsedCycleMs = Math.min(msInCycle, endDate.getTime() - lastCollected.getTime());
    const currentElapsedMs = Math.max(0, now.getTime() - lastCollected.getTime());
    
    if (currentElapsedMs < maxElapsedCycleMs || maxElapsedCycleMs <= 0) {
      if (!suppressAlert) alert("You can only collect profit when the cycle is mature.");
      return;
    }
    
    const dailyIncome = getDailyIncome(investment, currentUser, users, investments);

    const profitToCollect = (maxElapsedCycleMs / msInADay) * dailyIncome;

    const newLastCollected = new Date(lastCollected.getTime() + maxElapsedCycleMs);
    const isFinished = newLastCollected.getTime() >= endDate.getTime();
    
    // Update investment status
    setInvestments((prev) =>
      prev.map((inv) =>
        inv.id === investmentId
          ? { ...inv, status: isFinished ? ("completed" as const) : ("active" as const), lastCollectedDate: newLastCollected.toISOString() }
          : inv,
      ),
    );

    const totalToAdd = profitToCollect + (isFinished ? investment.amount : 0);

    // Add to user balance
    setUsers((users) =>
      users.map((u) =>
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
        id: Math.random().toString(36).substr(2, 9),
        userId: currentUser.id,
        investmentId: investment.id,
        planName: investment.planName,
        amount: totalToAdd,
        date: now.toISOString(),
      }, ...prev]);
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

  const claimTask = (taskId: string, reward: number) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          const claimedTasks = u.claimedTasks || [];
          if (claimedTasks.includes(taskId)) return u;
          return {
            ...u,
            balance: u.balance + reward,
            claimedTasks: [...claimedTasks, taskId]
          }
        }
        return u;
      })
    );
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const claimedTasks = prev.claimedTasks || [];
      if (claimedTasks.includes(taskId)) return prev;
      return {
        ...prev,
        balance: prev.balance + reward,
        claimedTasks: [...claimedTasks, taskId]
      };
    });
  };

  const addSystemDepositAccount = (account: Omit<SystemDepositAccount, "id">) => {
    setSystemDepositAccounts(prev => [...prev, { ...account, id: Math.random().toString(36).substr(2,9) }]);
  };

  const editSystemDepositAccount = (id: string, account: Partial<SystemDepositAccount>) => {
    setSystemDepositAccounts(prev => prev.map(a => a.id === id ? { ...a, ...account } : a));
  };

  const deleteSystemDepositAccount = (id: string) => {
    setSystemDepositAccounts(prev => prev.filter(a => a.id !== id));
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
        adminResetUserPassword,
        addProduct,
        editProduct,
        deleteProduct,
        upgradeVip,
        addBalance,
        claimTask,
        addSystemDepositAccount,
        editSystemDepositAccount,
        deleteSystemDepositAccount,
        announcement,
        setAnnouncement,
        adminWhatsApp,
        setAdminWhatsApp,
        adminUsdtAddress,
        setAdminUsdtAddress,
        promoImage,
        setPromoImage,
        aboutUsImage,
        setAboutUsImage,
        carouselImages,
        addCarouselImage,
        removeCarouselImage,
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
