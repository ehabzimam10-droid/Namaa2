import type { Kid, ActiveLeague } from '../data/mockData';
import type { UserProfile } from '../context/AppContext';

export const LEAGUE_GOAL_TITLE = 'تحدي دوري العائلة الادخاري 🏆';

export type TxCategory =
  | 'allowance'
  | 'reward'
  | 'savings'
  | 'investment'
  | 'donation'
  | 'purchase'
  | 'other';

export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function deepClone<T>(val: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(val);
  }
  return JSON.parse(JSON.stringify(val));
}

export function resolveActiveKid(profile: UserProfile | null, kids: Kid[]): Kid {
  if (!kids || kids.length === 0) {
    return {
      id: 'kid_salem',
      name: 'سالم',
      age: 10,
      balance: 0,
      saved: 0,
      allowance: 50,
      donationPoints: 0,
      tasks: [],
      savingsGoals: [],
      transactions: [],
    };
  }

  if (profile?.name) {
    const matched = kids.find((k) => k.name === profile.name || k.id === profile.name);
    if (matched) return matched;
  }

  return kids.find((k) => k.name === 'سالم') || kids[0];
}

export function inferTxCategory(title: string, type: 'deposit' | 'withdrawal' | 'دوري_جديد' = 'deposit'): TxCategory {
  if (type === 'withdrawal') {
    if (title.includes('شراء') || title.includes('دفع') || title.includes('مشتريات')) return 'purchase';
    if (title.includes('استثمار') || title.includes('مشروع')) return 'investment';
    if (title.includes('تبرع') || title.includes('خير')) return 'donation';
    if (title.includes('ادخار') || title.includes('حصالة')) return 'savings';
    return 'purchase';
  }

  if (title.includes('مصروف') || title.includes('دوري') || title.includes('تحويل')) return 'allowance';
  if (title.includes('مكافأة') || title.includes('جائزة') || title.includes('مهمة')) return 'reward';
  if (title.includes('استثمار') || title.includes('عائد') || title.includes('أرباح')) return 'investment';
  if (title.includes('تبرع') || title.includes('نقاط')) return 'donation';
  if (title.includes('ادخار') || title.includes('حصالة') || title.includes('استحقاق')) return 'savings';

  return 'other';
}

export function computeLeagueScores(
  kid: Kid,
  activeLeague: ActiveLeague | null,
  overrideSpendingScore?: number
): {
  total: number;
  savingsScore: number;
  investScore: number;
  donationScore: number;
  tasksScore: number;
  spendingScore: number;
} {
  const bases = activeLeague?.bases || ['الادخار', 'الاستثمار', 'التبرع', 'إنجاز المهام', 'إدارة المصروف'];

  let savingsAmount = 0;
  if (kid.savingsGoals) {
    savingsAmount = kid.savingsGoals.reduce((sum, g) => sum + (g.currentAmount || 0), 0);
  }
  const savingsScore = bases.includes('الادخار') ? Math.min(100, Math.floor(savingsAmount / 10) * 10) : 0;

  const investScore = bases.includes('الاستثمار') ? 75 : 0;
  const donationScore = bases.includes('التبرع') ? Math.min(100, (kid.donationPoints || 0) * 5) : 0;

  const completedTasks = (kid.tasks || []).filter(
    (t) => t.status === 'completed' || t.status === 'approved'
  ).length;
  const tasksScore = bases.includes('إنجاز المهام') ? Math.min(100, completedTasks * 20) : 0;

  let spendingScore = 80;
  if (overrideSpendingScore !== undefined) {
    spendingScore = overrideSpendingScore;
  } else if (activeLeague?.spendingScores && activeLeague.spendingScores[kid.id] !== undefined) {
    spendingScore = activeLeague.spendingScores[kid.id];
  }
  if (!bases.includes('إدارة المصروف')) {
    spendingScore = 0;
  }

  const activeCount = bases.length || 1;
  const total = Math.round((savingsScore + investScore + donationScore + tasksScore + spendingScore) / activeCount);

  return {
    total,
    savingsScore,
    investScore,
    donationScore,
    tasksScore,
    spendingScore,
  };
}

export function pickSpendingScore(
  kidId: string,
  league?: ActiveLeague | null,
  customScores?: Record<string, number>
): number {
  if (customScores && customScores[kidId] !== undefined) return customScores[kidId];
  if (league?.spendingScores && league.spendingScores[kidId] !== undefined) return league.spendingScores[kidId];
  return 80;
}
