import type { Investment, User } from "./store";
import { VIP_LEVELS, VIP_MEMBER_EXCLUSIVE_TIERS } from "./vip";

export function getDailyIncome(
  investment: Investment,
  user: User | undefined,
  allUsers: User[],
  allInvestments: Investment[]
): number {
  let dailyIncome = investment.fixedDailyReturn !== undefined 
    ? investment.fixedDailyReturn 
    : investment.amount * (investment.expectedRoi / 100);

  if (investment.planName === "VIP Member Exclusive Project" && user) {
    const userLevelName = VIP_LEVELS[user.vipLevelIndex || 0]?.name || "VIP0";
    dailyIncome = VIP_MEMBER_EXCLUSIVE_TIERS[userLevelName]?.dailyIncome || 0;
  }

  if (investment.planName === "VIP team exclusive project" && user) {
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
      if (subInv.planName === "VIP team exclusive project") {
         subordinateTotalDailyIncome += subInv.fixedDailyReturn || 300;
      } else {
         subordinateTotalDailyIncome += getDailyIncome(subInv, subUser, [], []);
      }
    }
    const bonus = subordinateTotalDailyIncome * 0.01;
    dailyIncome += bonus;
  }

  return dailyIncome;
}
