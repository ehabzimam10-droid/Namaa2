export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  isLocked: boolean;
  deadlineDate?: string;
}

export interface ActiveLeague {
  id?: string | number;
  isActive: boolean;
  prize: string;
  bases: string[];
  startDate?: string;
  endDate?: string;
  allowances?: { [kidId: string]: number };
  spendingScores?: { [kidId: string]: number };
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'دوري_جديد';
  date: string;
}

export interface Task {
  id: string;
  title: string;
  rewardAmount: number;
  rewardType: 'cash' | 'points' | 'custom';
  customReward?: string;
  status: 'pending' | 'under_review' | 'completed' | 'approved' | 'failed' | 'expired';
  endDate?: string;
  createdAt?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Kid {
  id: string;
  name: string;
  age: number;
  allowance: number;
  saved: number;
  balance: number;
  donationPoints: number;
  transactions: Transaction[];
  tasks: Task[];
  savingsGoals: SavingsGoal[];
  is_league_winner?: boolean;
  last_savings_points?: number;
  last_league_score?: number;
  bank_level?: number;
  farm_level?: number;
  market_level?: number;
  center_level?: number;
  tasks_level?: number;
}

export interface Father {
  name: string;
}

export interface FamilyProject {
  id: string;
  title: string;
  totalRequired: number;
  currentInvested: number;
  roiPercentage: number;
  contributors: Record<string, number>;
}

export interface FamilyData {
  father: Father;
  kids: Kid[];
  projects: FamilyProject[];
}

export const mockFamilyData: FamilyData = {
  father: {
    name: "أبو خالد",
  },
  kids: [
    {
      id: "kid_khalid",
      name: "خالد",
      age: 15,
      allowance: 500,
      saved: 100,
      balance: 0,
      donationPoints: 0,
      transactions: [
        {
          id: "tx_k_1",
          title: "مصروف الجيب الأسبوعي",
          amount: 500,
          type: "deposit",
          date: "2026-06-25",
        },
        {
          id: "tx_k_2",
          title: "شراء كتاب للبرمجة",
          amount: 150,
          type: "withdrawal",
          date: "2026-06-26",
        },
        {
          id: "tx_k_3",
          title: "مكافأة إتمام التحدي الرياضي",
          amount: 50,
          type: "deposit",
          date: "2026-06-28",
        },
        {
          id: "tx_k_4",
          title: "اشتراك إنترنت شهري",
          amount: 300,
          type: "withdrawal",
          date: "2026-06-29",
        },
      ],
      tasks: [
        {
          id: "task_k_1",
          title: "إنهاء كورس البرمجة المبتدئ",
          rewardAmount: 150,
          rewardType: "cash",
          status: "pending",
          difficulty: "medium",
          createdAt: new Date().toISOString()
        }
      ],
      savingsGoals: [
        {
          id: "goal_k_1",
          title: "شراء جهاز ألعاب جديد",
          targetAmount: 1500,
          currentAmount: 100,
          isLocked: true
        }
      ],
    },
    {
      id: "kid_salem",
      name: "سالم",
      age: 10,
      allowance: 100,
      saved: 60,
      balance: 300,
      donationPoints: 0,
      transactions: [
        {
          id: "tx_s_1",
          title: "مصروف الجيب الأسبوعي",
          amount: 100,
          type: "deposit",
          date: "2026-06-25",
        },
        {
          id: "tx_s_2",
          title: "شراء علبة ألوان رسم",
          amount: 30,
          type: "withdrawal",
          date: "2026-06-26",
        },
        {
          id: "tx_s_3",
          title: "مكافأة مساعدة في ترتيب المنزل",
          amount: 10,
          type: "deposit",
          date: "2026-06-27",
        },
        {
          id: "tx_s_4",
          title: "شراء حلوى وصودا",
          amount: 20,
          type: "withdrawal",
          date: "2026-06-28",
        },
      ],
      tasks: [],
      savingsGoals: [],
    },
  ],
  projects: [
    {
      id: "project_coffee",
      title: "مشروع آلة القهوة المنزلية ☕",
      totalRequired: 1000,
      currentInvested: 200,
      roiPercentage: 10,
      contributors: { "سالم": 200 }
    }
  ],
};

export const donationCauses = [
  { id: 1, title: 'سقيا ماء 💧' },
  { id: 2, title: 'كفالة يتيم 👨👩👦' },
  { id: 3, title: 'كسوة شتاء 🧥' }
];
