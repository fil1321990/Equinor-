import type { Investment, User } from "../store";
import { VIP_LEVELS, VIP_MEMBER_EXCLUSIVE_TIERS } from "../services/vip";

export function getDailyIncome(
  investment: Investment,
  user: User | undefined,
  allUsers: User[],
  allInvestments: Investment[]
): number {
  let dailyIncome = investment.fixedDailyReturn != null 
    ? Number(investment.fixedDailyReturn)
    : (Number(investment.amount || 0) * (1 + Number(investment.expectedRoi || 0) / 100)) / (investment.total_duration_days || 1);

  if (investment.planName === "VIP Member Exclusive Project") {
    let userLevelName = user ? (VIP_LEVELS[user.vipLevelIndex || 0]?.name || "VIP0") : "VIP0";
    if (userLevelName === "VIP0") userLevelName = "VIP1"; // Show at least VIP1 rates for preview/UI
    dailyIncome = VIP_MEMBER_EXCLUSIVE_TIERS[userLevelName]?.dailyIncome || 0;
  }

  if (investment.planName === "VIP Team Exclusive Project" && user && investment.id !== "mock") {
    const aLevelSubordinateUids = allUsers
      .filter((u) => u.referredBy === user.referralCode)
      .map((u) => u.id);
    let subordinateTotalDailyIncome = 0;
        
    // Calculate total daily income of all A-level subordinates
    const subordinateInvestments = allInvestments.filter(
      (inv) => aLevelSubordinateUids.includes(inv.userId) && inv.status === 'active'
    );
        
    for (const subInv of subordinateInvestments) {
      const subUser = allUsers.find(u => u.id === subInv.userId);
      if (subInv.planName === "VIP Team Exclusive Project") {
         subordinateTotalDailyIncome += subInv.fixedDailyReturn != null ? subInv.fixedDailyReturn : (subInv.amount || 0) * (1 + (subInv.expectedRoi || 0) / 100);
      } else {
         subordinateTotalDailyIncome += getDailyIncome(subInv, subUser, [], []);
      }
    }
    const bonus = subordinateTotalDailyIncome * 0.01;
    dailyIncome = bonus;
  }

  return dailyIncome;
}
