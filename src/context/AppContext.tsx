import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { mockFamilyData } from '../data/mockData';
import type { Kid, FamilyProject, Task, Transaction, SavingsGoal, ActiveLeague } from '../data/mockData';
import { supabase } from '../utils/supabaseClient';

export interface UserProfile {
  name: string;
  role: 'father' | 'kid' | 'dev';
  email?: string;
  family_castle_level?: number;
}

export interface Notification {
  id: string;
  userId: string;
  role: 'father' | 'kid';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface AppContextType {
  profile: UserProfile | null;
  kids: Kid[];
  projects: FamilyProject[];
  setProfile: (profile: UserProfile | null) => void;
  addDonation: (kidId: string, amount: number) => Promise<void>;
  approveTask: (kidId: string, taskTitle: string, rewardAmount: number, rewardType: 'cash' | 'points' | 'custom', customReward?: string) => Promise<void>;
  addProject: (title: string, totalRequired: number, roiPercentage: number) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  investInProject: (kidName: string, projectId: string, amount: number) => Promise<void>;
  addSavingsGoal: (kidName: string, title: string, targetAmount: number, deadlineDate?: string) => Promise<void>;
  addToGoal: (kidName: string, goalId: string, amount: number) => Promise<void>;
  withdrawGoal: (kidName: string, goalId: string) => Promise<void>;
  submitTaskProof: (taskId: string) => Promise<void>;
  transferMoney: (kidId: string, amount: number, reason: string) => Promise<void>;
  finalizeTaskApproval: (taskId: string) => Promise<void>;
  logout: () => void;
  assignManualTask: (kidName: string, title: string, amount: number, type: 'cash' | 'points' | 'custom', customReward?: string, endDate?: string, difficulty?: 'easy' | 'medium' | 'hard') => Promise<void>;
  calculateROI: (investedAmount: number, roiPercentage: number) => number;
  updateKidLevels: (kidId: string, bank: number, farm: number, market: number, tasks: number) => Promise<void>;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  notifications: Notification[];
  addNotification: (userId: string, role: 'father' | 'kid', title: string, message: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  runCleanup: () => Promise<void>;
  activeLeague: ActiveLeague;
  startFamilyLeague: (prize: string, bases: string[], endDate: string, allowancesRecord: { [kidId: string]: number }) => Promise<void>;
  endFamilyLeague: (leagueId: string | number, finalSpendingScores?: Record<string, number>) => Promise<void>;
  calculateKidScores: (kid: Kid) => {
    savingsScore: number;
    savingsAmount: number;
    investmentScore: number;
    investmentAmount: number;
    donationScore: number;
    donationAmount: number;
    tasksScore: number;
    approvedTasks: number;
    totalTasks: number;
    spendingScore: number;
    spentAmount: number;
    totalPoints: number;
    monthlyAllowance: number;
  };
  transferAllowance: (kidId: string, amount: number) => Promise<void>;
  simulateDailyPurchase: (kidName: string, amount: number, reason: string) => Promise<void>;
  toast: { show: boolean; message: string; type: 'success' | 'error' | null };
  showToast: (message: string, type: 'success' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const savedProfile = localStorage.getItem('namaa_profile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const [toast, setToastState] = useState<{ show: boolean; message: string; type: 'success' | 'error' | null }>({
    show: false,
    message: '',
    type: null,
  });

  const toastTimerRef = useRef<any>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastState({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToastState({ show: false, message: '', type: null });
    }, 3000);
  };

  const [kids, setKids] = useState<Kid[]>(() => {
    const savedKids = localStorage.getItem('namaa_kids_v14');
    return savedKids ? JSON.parse(savedKids) : mockFamilyData.kids;
  });
  
  const [projects, setProjects] = useState<FamilyProject[]>(() => {
    const savedProjects = localStorage.getItem('namaa_projects_v14');
    return savedProjects ? JSON.parse(savedProjects) : mockFamilyData.projects;
  });

  const [activeLeague, setActiveLeague] = useState<ActiveLeague>(() => {
    const saved = localStorage.getItem('namaa_active_league');
    return saved ? JSON.parse(saved) : { isActive: false, prize: '', bases: [] };
  });

  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(() => {
    return localStorage.getItem('namaa_gemini_api_key') || '';
  });

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
    localStorage.setItem('namaa_gemini_api_key', key);
  };

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('namaa_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('namaa_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = async (userId: string, role: 'father' | 'kid', title: string, message: string) => {
    const newNotif: Notification = {
      id: `notif_${Date.now()}_${Math.random()}`,
      userId,
      role,
      title,
      message,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    try {
      await supabase.from('notifications').insert({
        user_id: userId,
        role,
        title,
        message,
        is_read: false
      });
    } catch (err) {
      console.warn('Failed to sync notification to Supabase, saving locally:', err);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      const dbId = isNaN(Number(id)) ? id : Number(id);
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', dbId);
    } catch (err) {
      console.error('Failed to update notification status in Supabase:', err);
    }
  };

  useEffect(() => {
    localStorage.setItem('namaa_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('namaa_kids_v14', JSON.stringify(kids));
  }, [kids]);

  useEffect(() => {
    localStorage.setItem('namaa_projects_v14', JSON.stringify(projects));
  }, [projects]);

  const fetchData = async () => {
    try {
      const [
        { data: dbKids, error: kidsError },
        { data: dbProjects, error: projError },
        { data: dbTasks },
        { data: dbGoals },
        { data: dbTx }
      ] = await Promise.all([
        supabase.from('kids_profiles').select('*'),
        supabase.from('family_projects').select('*'),
        supabase.from('kid_tasks').select('*'),
        supabase.from('savings_goals').select('*'),
        supabase.from('transactions').select('*')
      ]);

      if (!projError && dbProjects && dbProjects.length > 0) {
        const mappedProjects: FamilyProject[] = dbProjects.map((p: any) => ({
          id: p.id?.toString() || `project_${Date.now()}_${Math.random()}`,
          title: p.title,
          totalRequired: p.total_required,
          currentInvested: p.current_invested || 0,
          roiPercentage: p.roi_percentage,
          contributors: p.contributors || {},
        }));
        setProjects(mappedProjects);
      }

      if (!kidsError && dbKids && dbKids.length > 0) {
        setKids((prevKids) =>
          dbKids.map((k: any) => {
            const prevKid = prevKids.find(pk => pk.name === k.name) || mockFamilyData.kids.find(lk => lk.name === k.name) || mockFamilyData.kids[0];
            
            const kidDbTasks = dbTasks ? dbTasks.filter((t: any) => t.kid_name === k.name) : [];
            const mappedTasks = mappedTasksFromDb(kidDbTasks);

            const kidGoals = dbGoals ? dbGoals.filter((g: any) => g.kid_name === k.name) : [];
            const mappedGoals: SavingsGoal[] = kidGoals.map((g: any) => ({
              id: g.id?.toString(),
              title: g.title,
              targetAmount: g.target_amount,
              currentAmount: g.current_amount,
              isLocked: g.is_locked,
              deadlineDate: g.deadline_date || undefined
            }));

            const kidTx = dbTx ? dbTx.filter((t: any) => t.kid_name === k.name) : [];
            const mappedTx: Transaction[] = kidTx.map((t: any) => ({
              id: t.id?.toString(),
              title: t.title,
              amount: t.amount,
              type: t.type as 'deposit' | 'withdrawal',
              date: t.date || new Date().toISOString().split('T')[0]
            })).sort((a, b) => b.id.localeCompare(a.id));

            return {
              ...prevKid,
              id: k.id,
              name: k.name,
              age: k.age || prevKid.age,
              balance: k.balance || 0,
              donationPoints: k.donation_points || 0,
              allowance: k.allowance || prevKid.allowance || 0,
              tasks: mappedTasks,
              savingsGoals: mappedGoals,
              transactions: mappedTx,
              is_league_winner: !!k.is_league_winner,
              last_savings_points: k.last_savings_points || 0,
              last_league_score: k.last_league_score || 0,
              bank_level: k.bank_level || 3,
              farm_level: k.farm_level || 3,
              market_level: k.market_level || 3,
              center_level: k.center_level || 3,
              tasks_level: k.tasks_level || 3,
            };
          })
        );
      }

      let fetchedNotifs: Notification[] = [];
      try {
        const { data: dbNotifs, error: notifError } = await supabase
          .from('notifications')
          .select('*');
        if (!notifError && dbNotifs && dbNotifs.length > 0) {
          fetchedNotifs = dbNotifs.map((n: any) => ({
            id: n.id?.toString(),
            userId: n.user_id || n.userId,
            role: n.role as 'father' | 'kid',
            title: n.title,
            message: n.message,
            createdAt: n.created_at || n.createdAt || new Date().toISOString(),
            isRead: n.is_read !== undefined ? n.is_read : n.isRead,
          })).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        }
      } catch (err) {
        console.warn('Failed to fetch notifications from Supabase, using localStorage:', err);
        const saved = localStorage.getItem('namaa_notifications');
        fetchedNotifs = saved ? JSON.parse(saved) : [];
      }
      setNotifications(fetchedNotifs);

      // Fetch active or recently ended family league
      try {
        const { data: dbLeagues, error: leagueError } = await supabase
          .from('family_leagues')
          .select('*')
          .order('end_date', { ascending: false })
          .limit(1);
        
        if (!leagueError && dbLeagues && dbLeagues.length > 0) {
          const active = dbLeagues[0];
          const allowancesData = active.allowances || {};
          const spendingScores = allowancesData.spendingScores || undefined;

          setActiveLeague({
            id: active.id,
            isActive: active.is_active,
            prize: active.prize,
            bases: active.bases || [],
            startDate: active.start_date,
            endDate: active.end_date,
            allowances: allowancesData,
            spendingScores: spendingScores
          });
        } else {
          setActiveLeague({ isActive: false, prize: '', bases: [] });
        }
      } catch (err) {
        console.warn('Failed to fetch active league from Supabase:', err);
      }
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const mappedTasksFromDb = (dbTasks: any[]): Task[] => {
    return dbTasks.map((t: any) => ({
      id: t.id?.toString() || `task_${Date.now()}_${Math.random()}`,
      title: t.title,
      rewardAmount: t.reward_amount,
      rewardType: t.reward_type,
      customReward: t.reward_type === 'custom' ? t.title : undefined,
      status: (t.status as Task['status']) || 'pending',
      endDate: t.end_date || undefined,
      createdAt: t.created_at || new Date().toISOString(),
    }));
  };

  const setProfile = (newProfile: UserProfile | null) => {
    setProfileState(newProfile);
  };

  const logout = () => {
    setProfileState(null);
  };

  const logTransaction = async (kidName: string, title: string, amount: number, type: 'deposit' | 'withdrawal' | 'دوري_جديد') => {
    const newTx: Transaction = {
      id: `tx_${Date.now()}_${Math.random()}`,
      title,
      amount,
      type,
      date: new Date().toISOString(),
    };

    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.name === kidName) {
          return {
            ...kid,
            transactions: [newTx, ...(kid.transactions || [])],
          };
        }
        return kid;
      })
    );

    try {
      await supabase
        .from('transactions')
        .insert({
          title,
          amount,
          type,
          kid_name: kidName,
          date: new Date().toISOString()
        });
    } catch (err) {
      console.error('Failed to log transaction to Supabase:', err);
    }
  };

  const addDonation = async (kidId: string, amount: number) => {
    const targetKid = kids.find((k) => k.id === kidId);
    if (!targetKid) return;

    const updatedBalance = Math.max(0, targetKid.balance - amount);
    const newPoints = targetKid.donationPoints + amount;

    // Local Optimistic update
    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.id === kidId) {
          return {
            ...kid,
            balance: updatedBalance,
            donationPoints: newPoints,
          };
        }
        return kid;
      })
    );

    // Notify Father of donation
    addNotification('father', 'father', 'تبرع جديد للمسؤولية المجتمعية 💚', `قام ${targetKid.name} بالتبرع بمبلغ ${amount} ريال للمسؤولية المجتمعية.`);

    // Supabase Update & Log Transaction
    try {
      await Promise.all([
        supabase
          .from('kids_profiles')
          .update({ balance: updatedBalance, donation_points: newPoints })
          .eq('id', kidId),
        logTransaction(targetKid.name, `تبرع للمسؤولية المجتمعية 💚`, amount, 'withdrawal')
      ]);
    } catch (err) {
      console.error('Failed to sync donation to Supabase:', err);
    }
  };

  const approveTask = async (
    kidId: string,
    taskTitle: string,
    rewardAmount: number,
    rewardType: 'cash' | 'points' | 'custom',
    customReward?: string
  ) => {
    // Optimistic UI update
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: taskTitle,
      rewardAmount,
      rewardType,
      customReward,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.id === kidId) {
          return {
            ...kid,
            tasks: [...(kid.tasks || []), newTask],
          };
        }
        return kid;
      })
    );

    try {
      const kid = kids.find(k => k.id === kidId);
      const kid_name = kid ? kid.name : '';
      await supabase.from('kid_tasks').insert({
        title: taskTitle,
        reward_amount: rewardAmount,
        reward_type: rewardType,
        status: 'pending',
        kid_name
      });
    } catch (err) {
      console.error('Failed to sync approved task to Supabase:', err);
    }
  };

  const addProject = async (title: string, totalRequired: number, roiPercentage: number) => {
    // Optimistic UI update
    const newProj: FamilyProject = {
      id: `project_${Date.now()}`,
      title,
      totalRequired,
      currentInvested: 0,
      roiPercentage,
      contributors: {},
    };
    setProjects((prevProj) => [newProj, ...prevProj]);

    // Send notification to all kids
    kids.forEach((k) => {
      addNotification(k.id, 'kid', 'مشروع جديد', 'مشروع استثماري عائلي جديد متاح!');
    });

    try {
      await supabase.from('family_projects').insert({
        title,
        total_required: totalRequired,
        current_invested: 0,
        roi_percentage: roiPercentage,
        contributors: {}
      });
    } catch (err) {
      console.error('Failed to sync added project to Supabase:', err);
    }
  };

  const deleteProject = async (projectId: string) => {
    const targetProj = projects.find((p) => p.id === projectId);
    if (!targetProj) return;

    const contributors = targetProj.contributors || {};
    
    // Create copy of kids list to update balances locally
    const updatedKidsList = [...kids];
    const supabaseUpdates: any[] = [];

    // For each contributor, refund their money
    for (const [kidName, amount] of Object.entries(contributors)) {
      const kidAmount = Number(amount);
      if (kidAmount <= 0) continue;

      const targetKid = updatedKidsList.find((k) => k.name === kidName);
      if (targetKid) {
        const newBalance = targetKid.balance + kidAmount;
        targetKid.balance = newBalance;
        
        // Log transaction and supabase update
        supabaseUpdates.push(
          logTransaction(kidName, `استرداد مساهمة مشروع ملغى: ${targetProj.title} 🔄`, kidAmount, 'deposit')
        );
        supabaseUpdates.push(
          supabase
            .from('kids_profiles')
            .update({ balance: newBalance })
            .eq('id', targetKid.id)
        );
      }
    }

    // Delete locally
    setProjects((prevProj) => prevProj.filter((p) => p.id !== projectId));
    setKids(updatedKidsList);

    // Delete project from Supabase
    supabaseUpdates.push(
      supabase
        .from('family_projects')
        .delete()
        .eq('id', projectId)
    );

    try {
      await Promise.all(supabaseUpdates);
      showToast(`تم حذف المشروع "${targetProj.title}" وإرجاع المساهمات بنجاح! 🔄💸`, 'success');
    } catch (err) {
      console.error('Failed to delete family project or refund contributors in Supabase:', err);
      showToast('حدث خطأ أثناء حذف المشروع.', 'error');
    }
  };

  const investInProject = async (kidName: string, projectId: string, amount: number) => {
    const targetKid = kids.find((k) => k.name === kidName);
    if (!targetKid) return;

    const kidId = targetKid.id;
    const updatedBalance = Math.max(0, targetKid.balance - amount);

    // a. Find target project and add amount locally
    const targetProj = projects.find(p => p.id === projectId);
    const newInvestedAmount = targetProj ? targetProj.currentInvested + amount : amount;
    const projectContributors = targetProj?.contributors || {};
    const newContributors = {
      ...projectContributors,
      [kidName]: (projectContributors[kidName] || 0) + amount,
    };

    setProjects((prevProj) =>
      prevProj.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            currentInvested: newInvestedAmount,
            contributors: newContributors,
          };
        }
        return proj;
      })
    );

    // Notify Father of investment
    addNotification('father', 'father', 'مساهمة استثمارية جديدة 📈', `قام ${kidName} بالمساهمة بمبلغ ${amount} ريال في مشروع: ${targetProj?.title || 'مشاريع العائلة'}.`);

    // Check project completion
    if (targetProj && newInvestedAmount >= targetProj.totalRequired) {
      addNotification('father', 'father', 'اكتمل المشروع', 'تم اكتمال تمويل المشروع بنجاح!');
    }

    // c. Update the specific kid's local state (subtract amount from balance)
    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.name === kidName) {
          return {
            ...kid,
            balance: updatedBalance,
          };
        }
        return kid;
      })
    );

    // b. Supabase Call & Log Transaction
    try {
      await Promise.all([
        supabase
          .from('family_projects')
          .update({ current_invested: newInvestedAmount, contributors: newContributors })
          .eq('id', projectId),
        supabase
          .from('kids_profiles')
          .update({ balance: updatedBalance })
          .eq('id', kidId),
        logTransaction(kidName, `مساهمة استثمارية عائلية 📈`, amount, 'withdrawal')
      ]);
    } catch (err) {
      console.error('Failed to update project investment in Supabase:', err);
    }
  };

  const addSavingsGoal = async (kidName: string, title: string, targetAmount: number, deadlineDate?: string) => {
    const tempId = `goal_${Date.now()}`;
    const newGoal: SavingsGoal = {
      id: tempId,
      title,
      targetAmount,
      currentAmount: 0,
      isLocked: true,
      deadlineDate: deadlineDate || undefined,
    };

    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.name === kidName) {
          return {
            ...kid,
            savingsGoals: [...(kid.savingsGoals || []), newGoal],
          };
        }
        return kid;
      })
    );

    // Supabase Insert
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .insert({
          title,
          target_amount: targetAmount,
          current_amount: 0,
          is_locked: true,
          deadline_date: deadlineDate || null,
          kid_name: kidName
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setKids((prevKids) =>
          prevKids.map((kid) => {
            if (kid.name === kidName) {
              const updatedGoals = (kid.savingsGoals || []).map((g) => {
                if (g.id === tempId) {
                  return {
                    ...g,
                    id: data.id.toString(),
                  };
                }
                return g;
              });
              return {
                ...kid,
                savingsGoals: updatedGoals,
              };
            }
            return kid;
          })
        );
      }
    } catch (err) {
      console.error('Failed to sync added goal to Supabase:', err);
    }
  };

  const addToGoal = async (kidName: string, goalId: string, amount: number) => {
    const targetKid = kids.find((k) => k.name === kidName);
    if (!targetKid || targetKid.balance < amount) return;

    const targetGoal = (targetKid.savingsGoals || []).find(g => g.id === goalId);
    if (targetGoal && targetGoal.currentAmount >= targetGoal.targetAmount) {
      return;
    }

    const kidId = targetKid.id;
    const updatedBalance = Math.max(0, targetKid.balance - amount);
    const newCurrent = targetGoal ? targetGoal.currentAmount + amount : amount;

    // Local Update
    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.name === kidName) {
          const goal = (kid.savingsGoals || []).find((g) => g.id === goalId);
          if (goal && goal.currentAmount >= goal.targetAmount) {
            return kid;
          }

          const updatedGoals = (kid.savingsGoals || []).map((goalItem) => {
            if (goalItem.id === goalId) {
              return {
                ...goalItem,
                currentAmount: newCurrent,
                isLocked: newCurrent < goalItem.targetAmount,
              };
            }
            return goalItem;
          });

          return {
            ...kid,
            balance: updatedBalance,
            savingsGoals: updatedGoals,
          };
        }
        return kid;
      })
    );

    // Notify Father of deposit to savings goal
    addNotification('father', 'father', 'إيداع جديد في الحصالة 🔒', `قام ${kidName} بإيداع مبلغ ${amount} ريال في حصالة الادخار الخاصة به.`);

    // Check if Goal Reached (to Kid)
    if (targetGoal && newCurrent >= targetGoal.targetAmount && targetGoal.currentAmount < targetGoal.targetAmount) {
      addNotification(kidId, 'kid', 'تحقيق الهدف 🎉', 'مبروك! لقد حققت هدف الحصالة بنجاح 🎯');
    }

    // Supabase Update
    try {
      const computedSaved = (targetKid.savingsGoals || []).reduce((sum, goal) => {
        if (goal.id === goalId) {
          return sum + goal.currentAmount + amount;
        }
        return sum + goal.currentAmount;
      }, 0);

      const dbGoalId = isNaN(Number(goalId)) ? goalId : Number(goalId);
      const isLocked = targetGoal ? newCurrent < targetGoal.targetAmount : true;

      await Promise.all([
        supabase
          .from('savings_goals')
          .update({ current_amount: newCurrent, is_locked: isLocked })
          .eq('id', dbGoalId),
        supabase
          .from('kids_profiles')
          .update({ balance: updatedBalance, saved: computedSaved })
          .eq('id', kidId),
        logTransaction(kidName, `إيداع في حصالة الادخار 🔒`, amount, 'withdrawal')
      ]);
    } catch (err) {
      console.error('Failed to update kid balance and savings in Supabase:', err);
    }
  };

  const withdrawGoal = async (kidName: string, goalId: string) => {
    const targetKid = kids.find((k) => k.name === kidName);
    if (!targetKid) return;

    const goal = (targetKid.savingsGoals || []).find((g) => g.id === goalId);
    if (!goal || goal.isLocked) return;

    if (goal.title === 'حصالة دوري العائلة 🏆' && activeLeague && activeLeague.isActive) {
      console.warn('Cannot withdraw from the active league savings goal.');
      return;
    }

    const kidId = targetKid.id;
    const amountToWithdraw = goal.currentAmount;
    const updatedBalance = targetKid.balance + amountToWithdraw;

    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.name === kidName) {
          const updatedGoals = (kid.savingsGoals || []).filter((g) => g.id !== goalId);

          return {
            ...kid,
            balance: updatedBalance,
            savingsGoals: updatedGoals,
          };
        }
        return kid;
      })
    );

    // Supabase Update
    try {
      const computedSaved = (targetKid.savingsGoals || []).filter(g => g.id !== goalId).reduce((sum, goal) => sum + goal.currentAmount, 0);
      const dbGoalId = isNaN(Number(goalId)) ? goalId : Number(goalId);

      await Promise.all([
        supabase
          .from('savings_goals')
          .delete()
          .eq('id', dbGoalId),
        supabase
          .from('kids_profiles')
          .update({ balance: updatedBalance, saved: computedSaved })
          .eq('id', kidId),
        logTransaction(kidName, `سحب مدخرات حصالة: ${goal.title} 🔓🎉`, amountToWithdraw, 'deposit')
      ]);
    } catch (err) {
      console.error('Failed to update kid balance and savings in Supabase:', err);
    }
  };

  const submitTaskProof = async (taskId: string) => {
    // Add notification to father
    addNotification('father', 'father', 'مراجعة مهمة', 'أنهى ابنك مهمة بانتظار الاعتماد');

    // Optimistic local state update
    setKids((prevKids) =>
      prevKids.map((kid) => {
        const updatedTasks = (kid.tasks || []).map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              status: 'under_review' as const,
            };
          }
          return t;
        });
        return {
          ...kid,
          tasks: updatedTasks,
        };
      })
    );

    try {
      const dbId = isNaN(Number(taskId)) ? taskId : Number(taskId);
      await supabase
        .from('kid_tasks')
        .update({ status: 'under_review' })
        .eq('id', dbId);
    } catch (err) {
      console.error('Failed to update task status in Supabase:', err);
    }
  };

  // Advanced Savings Auto-Unlock Checking Logic
  const checkSavingsStatus = () => {
    setKids((prevKids) => {
      let changed = false;
      const updatedKids = prevKids.map((kid) => {
        let kidChanged = false;
        let addedBalance = 0;
        const newTransactions: Transaction[] = [];

        const updatedGoals = (kid.savingsGoals || []).filter((goal) => {
          const isTargetAchieved = goal.currentAmount >= goal.targetAmount;
          const isDeadlinePassed = goal.deadlineDate && new Date() > new Date(goal.deadlineDate);

          if (goal.title === 'حصالة دوري العائلة 🏆' && activeLeague && activeLeague.isActive) {
            return true;
          }

          if (goal.isLocked && (isTargetAchieved || isDeadlinePassed)) {
            kidChanged = true;
            changed = true;
            addedBalance += goal.currentAmount;

            const dbGoalId = isNaN(Number(goal.id)) ? goal.id : Number(goal.id);
            // Async delete from Supabase
            supabase
              .from('savings_goals')
              .delete()
              .eq('id', dbGoalId)
              .then(({ error }) => {
                if (error) console.error('Failed to auto-delete expired goal from Supabase:', error);
              });

            // Async log transaction to Supabase
            logTransaction(kid.name, `استحقاق حصالة: ${goal.title} 💰`, goal.currentAmount, 'deposit')
              .catch((err) => console.error('Failed to log auto-unlock transaction:', err));

            const autoTx: Transaction = {
              id: `tx_auto_unlock_${Date.now()}_${Math.random()}`,
              title: `استحقاق حصالة: ${goal.title} 💰`,
              amount: goal.currentAmount,
              type: 'deposit',
              date: new Date().toISOString(),
            };
            newTransactions.push(autoTx);
            return false; // Deletes the goal
          }
          return true; // Keeps the goal
        });

        if (kidChanged) {
          const newBalance = kid.balance + addedBalance;
          
          // Sync this change to Supabase asynchronously
          const computedSaved = updatedGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
          supabase
            .from('kids_profiles')
            .update({ balance: newBalance, saved: computedSaved })
            .eq('id', kid.id)
            .then(({ error }) => {
              if (error) console.error('Failed to sync auto-unlocked balance to Supabase:', error);
            });

          return {
            ...kid,
            balance: newBalance,
            savingsGoals: updatedGoals,
            transactions: [...newTransactions, ...(kid.transactions || [])],
          };
        }
        return kid;
      });

      return changed ? updatedKids : prevKids;
    });
  };

  const finalizeTaskApproval = async (taskId: string) => {
    let foundKid: Kid | undefined;
    let foundTask: Task | undefined;

    for (const kid of kids) {
      const task = (kid.tasks || []).find((t) => t.id === taskId);
      if (task) {
        foundKid = kid;
        foundTask = task;
        break;
      }
    }

    if (!foundKid || !foundTask) return;

    const isCash = foundTask.rewardType === 'cash';
    const amount = foundTask.rewardAmount;
    const newBalance = isCash ? foundKid.balance + amount : foundKid.balance;

    // Local state update
    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.id === foundKid!.id) {
          const updatedTasks = (kid.tasks || []).map((t) => {
            if (t.id === taskId) {
              return { ...t, status: 'approved' as const };
            }
            return t;
          });
          return {
            ...kid,
            balance: newBalance,
            tasks: updatedTasks,
          };
        }
        return kid;
      })
    );

    // Notify kid that the task was approved
    addNotification(foundKid.id, 'kid', 'اعتماد المهمة 🎯', 'تم اعتماد مهمتك واستلام الجائزة!');

    // Supabase updates
    try {
      const dbId = isNaN(Number(taskId)) ? taskId : Number(taskId);
      const updates: any[] = [
        supabase
          .from('kid_tasks')
          .update({ status: 'approved' })
          .eq('id', dbId)
      ];

      if (isCash) {
        updates.push(
          supabase
            .from('kids_profiles')
            .update({ balance: newBalance })
            .eq('id', foundKid.id)
        );
        updates.push(
          logTransaction(foundKid.name, `مكافأة إتمام مهمة: ${foundTask.title} 💸`, amount, 'deposit')
        );
      }

      await Promise.all(updates);
    } catch (err) {
      console.error('Failed to finalize task approval in Supabase:', err);
    }
  };

  const transferMoney = async (kidId: string, amount: number, reason: string) => {
    const targetKid = kids.find(k => k.id === kidId);
    if (!targetKid) return;

    const newBalance = targetKid.balance + amount;

    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.id === kidId) {
          return {
            ...kid,
            balance: newBalance,
          };
        }
        return kid;
      })
    );

    // Add notification to kid
    addNotification(kidId, 'kid', 'تحويل مالي 💸', `تم تحويل مبلغ ${amount} ريال لحسابك لسبب: ${reason}`);

    // Supabase Update & Log Transaction
    try {
      await Promise.all([
        supabase
          .from('kids_profiles')
          .update({ balance: newBalance })
          .eq('id', kidId),
        logTransaction(targetKid.name, `تحويل مالي: ${reason} 💸`, amount, 'deposit')
      ]);
    } catch (err) {
      console.error('Failed to sync money transfer to Supabase:', err);
    }
  };

  const transferAllowance = async (kidId: string, amount: number) => {
    const targetKid = kids.find(k => k.id === kidId);
    if (!targetKid) return;

    const newBalance = targetKid.balance + amount;

    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.id === kidId) {
          return {
            ...kid,
            balance: newBalance,
          };
        }
        return kid;
      })
    );

    addNotification(kidId, 'kid', 'استلام المصروف الشهري 💸', `تم تحويل مصروفك الشهري بقيمة ${amount} ريال وبدء دوري الأبناء!`);

    try {
      await Promise.all([
        supabase
          .from('kids_profiles')
          .update({ balance: newBalance })
          .eq('id', kidId),
        logTransaction(targetKid.name, `المصروف الشهري: allowance_granted 💸`, amount, 'deposit')
      ]);
    } catch (err) {
      console.error('Failed to sync allowance transfer to Supabase:', err);
    }
  };

  const simulateDailyPurchase = async (kidName: string, amount: number, reason: string) => {
    const targetKid = kids.find(k => k.name === kidName);
    if (!targetKid) return;

    const newBalance = Math.max(0, targetKid.balance - amount);

    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.name === kidName) {
          return {
            ...kid,
            balance: newBalance,
          };
        }
        return kid;
      })
    );

    // Notify kid
    const kidId = targetKid.id;
    addNotification(kidId, 'kid', 'عملية شراء جديدة 🛒', `تم خصم ${amount} ريال لشراء: ${reason}`);
    
    // Notify father
    addNotification('father', 'father', 'عملية شراء للابن 🛒', `قام ${kidName} بشراء ${reason} بقيمة ${amount} ريال.`);

    try {
      await Promise.all([
        supabase
          .from('kids_profiles')
          .update({ balance: newBalance })
          .eq('id', kidId),
        logTransaction(kidName, `شراء يومي: ${reason} 🛒`, amount, 'withdrawal')
      ]);
    } catch (err) {
      console.error('Failed to sync daily purchase to Supabase:', err);
    }
  };

  const calculateKidScores = (kid: Kid) => {
    if (!activeLeague || !activeLeague.startDate || !activeLeague.endDate) {
      return {
        savingsScore: 0,
        savingsAmount: 0,
        investmentScore: 0,
        investmentAmount: 0,
        donationScore: 0,
        donationAmount: 0,
        tasksScore: 0,
        approvedTasks: 0,
        totalTasks: 0,
        spendingScore: 0,
        spentAmount: 0,
        totalPoints: 0,
        monthlyAllowance: kid.allowance || 100,
      };
    }

    const baseAllowance = activeLeague.allowances?.[kid.id] || activeLeague.allowances?.[kid.name] || kid.allowance || 100;

    const startTime = new Date(activeLeague.startDate).getTime();
    const endTime = new Date(activeLeague.endDate).getTime();

    const currentLeagueTx = (kid.transactions || []).filter((tx) => {
      const txTime = new Date(tx.date).getTime();
      return txTime >= startTime && txTime <= endTime;
    });

    const currentLeagueTasks = (kid.tasks || []).filter((task) => {
      const taskTime = new Date(task.createdAt || task.endDate || '').getTime();
      if (isNaN(taskTime)) return false;
      return taskTime >= startTime && taskTime <= endTime;
    });

    // 1. Savings Points (Max 50) - Every 1% of allowance saved = 2 pts
    const leagueGoal = (kid.savingsGoals || []).find((g) => g.title === 'حصالة دوري العائلة 🏆');
    const savingsAmount = leagueGoal ? leagueGoal.currentAmount : 0;
    const savingsScore = activeLeague.isActive
      ? (activeLeague.bases.includes('الادخار') && baseAllowance > 0
        ? Math.min(50, Math.round(((savingsAmount / baseAllowance) * 100) * 2))
        : 0)
      : (kid.last_savings_points || 0);

    // 2. Investment Points (Max 50) - Every 1% of allowance invested = 5 pts
    const investmentAmount = currentLeagueTx
      .filter(tx => tx.type === 'withdrawal' && (tx.title.includes('استثمار') || tx.title.includes('مشروع')))
      .reduce((sum, tx) => sum + tx.amount, 0);
    const investmentScore = activeLeague.bases.includes('الاستثمار') && baseAllowance > 0
      ? Math.min(50, Math.round(((investmentAmount / baseAllowance) * 100) * 5))
      : 0;

    // 3. Donation Points (Max 50) - Every 1% of allowance donated = 5 pts
    const donationAmount = currentLeagueTx
      .filter(tx => tx.type === 'withdrawal' && tx.title.includes('تبرع'))
      .reduce((sum, tx) => sum + tx.amount, 0);
    const donationScore = activeLeague.bases.includes('التبرع') && baseAllowance > 0
      ? Math.min(50, Math.round(((donationAmount / baseAllowance) * 100) * 5))
      : 0;

    // 4. Tasks Points (Max 100) - Easy: 5 pts, Medium: 10 pts, Hard: 15 pts
    const totalTasks = currentLeagueTasks.length;
    const approvedTasks = currentLeagueTasks.filter(t => t.status === 'approved').length;
    const tasksScore = activeLeague.bases.includes('إنجاز المهام')
      ? Math.min(100, currentLeagueTasks.filter(t => t.status === 'approved').reduce((sum, t) => {
          const pts = t.difficulty === 'easy' ? 5 : t.difficulty === 'medium' ? 10 : t.difficulty === 'hard' ? 15 : 5;
          return sum + pts;
        }, 0))
      : 0;

    // 5. Spending Points (Max 100)
    const spentAmount = currentLeagueTx
      .filter(tx => {
        if (tx.type !== 'withdrawal') return false;
        const isSavings = tx.title.includes('إيداع في حصالة') || tx.title.includes('حصالة');
        const isInvestment = tx.title.includes('استثمار') || tx.title.includes('مشروع');
        const isDonation = tx.title.includes('تبرع');
        return !isSavings && !isInvestment && !isDonation;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const spendingScore = activeLeague.bases.includes('إدارة المصروف')
      ? (activeLeague.spendingScores?.[kid.id] || activeLeague.spendingScores?.[kid.name] || 0)
      : 0;

    const totalPoints = savingsScore + investmentScore + donationScore + tasksScore + spendingScore;

    return {
      savingsScore,
      savingsAmount,
      investmentScore,
      investmentAmount,
      donationScore,
      donationAmount,
      tasksScore,
      approvedTasks,
      totalTasks,
      spendingScore,
      spentAmount,
      totalPoints,
      monthlyAllowance: baseAllowance,
    };
  };

  const startFamilyLeague = async (
    prize: string,
    bases: string[],
    endDate: string,
    allowancesRecord: { [kidId: string]: number }
  ) => {
    try {
      const { data, error } = await supabase
        .from('family_leagues')
        .insert({
          prize,
          bases,
          is_active: true,
          start_date: new Date().toISOString(),
          end_date: endDate,
          allowances: allowancesRecord
        })
        .select()
        .single();
      
      if (error) throw error;

      if (data) {
        // Loop and transfer allowances
        const updatedKids = [...kids];
        for (const [kidId, amountVal] of Object.entries(allowancesRecord)) {
          const amount = Number(amountVal);
          const targetKid = updatedKids.find(k => k.id === kidId);
          if (targetKid) {
            const newBalance = targetKid.balance + amount;
            targetKid.balance = newBalance;

            // Sync kid's balance to Supabase
            await supabase
              .from('kids_profiles')
              .update({ balance: newBalance })
              .eq('id', kidId);

            // Log transaction with type 'دوري_جديد'
            await logTransaction(targetKid.name, `مصروف التحدي العائلي الجديد 🏆`, amount, 'دوري_جديد');
            
            // Send notification to kid
            await addNotification(kidId, 'kid', 'تحدي عائلي جديد 🏆', `تم إطلاق تحدي عائلي جديد! الجائزة: ${prize} 🏆`);

            // Automatically insert savings goal record
            const { data: goalData, error: goalError } = await supabase
              .from('savings_goals')
              .insert({
                title: 'حصالة دوري العائلة 🏆',
                target_amount: amount,
                current_amount: 0,
                is_locked: true,
                deadline_date: endDate,
                kid_name: targetKid.name
              })
              .select()
              .single();

            if (!goalError && goalData) {
              const localGoal: SavingsGoal = {
                id: goalData.id,
                title: 'حصالة دوري العائلة 🏆',
                targetAmount: amount,
                currentAmount: 0,
                isLocked: true,
                deadlineDate: endDate
              };
              targetKid.savingsGoals = [...(targetKid.savingsGoals || []), localGoal];
            }
          }
        }
        setKids(updatedKids);

        const newLeague = {
          id: data.id,
          isActive: true,
          prize,
          bases,
          startDate: data.start_date,
          endDate: data.end_date,
          allowances: allowancesRecord
        };
        setActiveLeague(newLeague);
        localStorage.setItem('namaa_active_league', JSON.stringify(newLeague));
      }
    } catch (err) {
      console.error('Failed to start family league:', err);
    }
  };

  const endFamilyLeague = async (leagueId: string | number, finalSpendingScores?: Record<string, number>) => {
    try {
      const isEvaluated = finalSpendingScores !== undefined;

      // Send notifications BEFORE executing deletion/updates to ensure delivery
      for (const kid of kids) {
        if (isEvaluated) {
          const score = finalSpendingScores?.[kid.id] || finalSpendingScores?.[kid.name] || 0;
          await addNotification(
            kid.id,
            'kid',
            'نتائج الدوري العائلي 🏆🏁',
            `انتهى الدوري! حصلت على تقييم مصروف: ${score} نقطة.`
          );
        } else {
          await addNotification(
            kid.id,
            'kid',
            'إلغاء التحدي 🛑',
            'قام والدك بإلغاء التحدي العائلي الحالي.'
          );
        }
      }

      if (isEvaluated) {
        await addNotification('father', 'father', 'نتائج الدوري العائلي 🏆🏁', 'تم إعلان نتائج الدوري بنجاح!');
      } else {
        await addNotification('father', 'father', 'إلغاء التحدي 🛑', 'تم إلغاء التحدي العائلي بنجاح.');
      }

      // 1. Update is_active to false in Supabase and store finalSpendingScores inside allowances JSON
      const { error: leagueError } = await supabase
        .from('family_leagues')
        .update({
          is_active: false,
          allowances: {
            ...activeLeague.allowances,
            spendingScores: finalSpendingScores
          }
        })
        .eq('id', leagueId);
      if (leagueError) throw leagueError;

      // 2. Delete all pending tasks in Supabase
      const { error: taskError } = await supabase
        .from('kid_tasks')
        .delete()
        .eq('status', 'pending');
      if (taskError) throw taskError;

      // Delete locally
      setKids((prevKids) =>
        prevKids.map((kid) => ({
          ...kid,
          tasks: (kid.tasks || []).filter(t => t.status !== 'pending')
        }))
      );

      // Automatically clean up 'حصالة دوري العائلة 🏆' and refund money
      const updatedKids = [...kids];

      // 3. Calculate each kid's current savings points and overall league points before refund/cleanup
      const tempActiveLeague = {
        ...activeLeague,
        spendingScores: finalSpendingScores || activeLeague.spendingScores || {}
      };

      const computedScores = updatedKids.map(k => {
        const baseAllowance = Number(tempActiveLeague.allowances?.[k.id] || tempActiveLeague.allowances?.[k.name] || k.allowance || 100);
        const startTime = new Date(tempActiveLeague.startDate!).getTime();
        const endTime = new Date(tempActiveLeague.endDate!).getTime();

        const currentLeagueTx = (k.transactions || []).filter((tx) => {
          const txTime = new Date(tx.date).getTime();
          return txTime >= startTime && txTime <= endTime;
        });

        const currentLeagueTasks = (k.tasks || []).filter((task) => {
          const taskTime = new Date(task.createdAt || task.endDate || '').getTime();
          if (isNaN(taskTime)) return false;
          return taskTime >= startTime && taskTime <= endTime;
        });

        // 1. Savings Points
        const leagueGoal = (k.savingsGoals || []).find((g) => g.title === 'حصالة دوري العائلة 🏆');
        const savingsAmount = leagueGoal ? leagueGoal.currentAmount : 0;
        const savingsScore = tempActiveLeague.bases.includes('الادخار') && baseAllowance > 0
          ? Math.min(50, Math.round(((savingsAmount / baseAllowance) * 100) * 2))
          : 0;

        // 2. Investment Points
        const investmentAmount = currentLeagueTx
          .filter(tx => tx.type === 'withdrawal' && (tx.title.includes('استثمار') || tx.title.includes('مشروع')))
          .reduce((sum, tx) => sum + tx.amount, 0);
        const investmentScore = tempActiveLeague.bases.includes('الاستثمار') && baseAllowance > 0
          ? Math.min(50, Math.round(((investmentAmount / baseAllowance) * 100) * 5))
          : 0;

        // 3. Donation Points
        const donationAmount = currentLeagueTx
          .filter(tx => tx.type === 'withdrawal' && tx.title.includes('تبرع'))
          .reduce((sum, tx) => sum + tx.amount, 0);
        const donationScore = tempActiveLeague.bases.includes('التبرع') && baseAllowance > 0
          ? Math.min(50, Math.round(((donationAmount / baseAllowance) * 100) * 5))
          : 0;

        // 4. Tasks Points
        const tasksScore = tempActiveLeague.bases.includes('إنجاز المهام')
          ? Math.min(100, currentLeagueTasks.filter(t => t.status === 'approved').reduce((sum, t) => {
              const pts = t.difficulty === 'easy' ? 5 : t.difficulty === 'medium' ? 10 : t.difficulty === 'hard' ? 15 : 5;
              return sum + pts;
            }, 0))
          : 0;

        // 5. Spending Points
        const spendingScore = tempActiveLeague.bases.includes('إدارة المصروف')
          ? (tempActiveLeague.spendingScores?.[k.id] || tempActiveLeague.spendingScores?.[k.name] || 0)
          : 0;

        const totalPoints = savingsScore + investmentScore + donationScore + tasksScore + spendingScore;

        return {
          kidId: k.id,
          savingsScore,
          totalPoints
        };
      });

      // Save frozen values to Database: Update Supabase kids_profiles
      for (const k of updatedKids) {
        const scores = computedScores.find(s => s.kidId === k.id);
        if (scores) {
          k.last_savings_points = scores.savingsScore;
          k.last_league_score = scores.totalPoints;
          await supabase
            .from('kids_profiles')
            .update({
              last_savings_points: scores.savingsScore,
              last_league_score: scores.totalPoints
            })
            .eq('id', k.id);
        }
      }

      // Determine league winner if evaluated (Draw logic: Khalid total score === Salem total score -> both win)
      if (isEvaluated && finalSpendingScores) {
        const maxScore = Math.max(...computedScores.map(s => s.totalPoints));
        const winnerIds = computedScores.filter(s => s.totalPoints === maxScore).map(s => s.kidId);

        for (const k of updatedKids) {
          const isWinner = winnerIds.includes(k.id);
          k.is_league_winner = isWinner;
          
          await supabase
            .from('kids_profiles')
            .update({ is_league_winner: isWinner })
            .eq('id', k.id);
        }
      }

      for (const kid of updatedKids) {
        const leagueGoal = (kid.savingsGoals || []).find(g => g.title === 'حصالة دوري العائلة 🏆');
        if (leagueGoal) {
          const refundAmount = leagueGoal.currentAmount;
          const newBalance = kid.balance + refundAmount;
          
          // Remove from local savingsGoals list
          kid.savingsGoals = (kid.savingsGoals || []).filter(g => g.title !== 'حصالة دوري العائلة 🏆');
          kid.balance = newBalance;

          // Delete from Supabase
          const dbGoalId = isNaN(Number(leagueGoal.id)) ? leagueGoal.id : Number(leagueGoal.id);
          await supabase.from('savings_goals').delete().eq('id', dbGoalId);

          // Update kid balance in Supabase
          const computedSaved = (kid.savingsGoals || []).reduce((sum, g) => sum + g.currentAmount, 0);
          await supabase.from('kids_profiles').update({ balance: newBalance, saved: computedSaved }).eq('id', kid.id);

          if (refundAmount > 0) {
            // Log transaction
            const txId = `tx_refund_${Date.now()}_${Math.random()}`;
            const newTx: Transaction = {
              id: txId,
              title: `استرداد مدخرات التحدي 💰`,
              amount: refundAmount,
              type: 'deposit',
              date: new Date().toISOString()
            };
            kid.transactions = [newTx, ...(kid.transactions || [])];
            await logTransaction(kid.name, `استرداد مدخرات التحدي 💰`, refundAmount, 'deposit');
          }
        }
      }
      setKids(updatedKids);

      const resetLeague = {
        ...activeLeague,
        isActive: false,
        spendingScores: finalSpendingScores
      };
      setActiveLeague(resetLeague);
      localStorage.setItem('namaa_active_league', JSON.stringify(resetLeague));

    } catch (err) {
      console.error('Failed to end family league:', err);
    }
  };

  const assignManualTask = async (
    kidName: string,
    title: string,
    amount: number,
    type: 'cash' | 'points' | 'custom',
    customReward?: string,
    endDate?: string,
    difficulty?: 'easy' | 'medium' | 'hard'
  ) => {
    // Add notification to kid
    const targetKid = kids.find((k) => k.name === kidName);
    const kidId = targetKid ? targetKid.id : 'kid_salem';
    addNotification(kidId, 'kid', 'مهمة جديدة', 'قام والدك بتكليفك بمهمة جديدة');

    const newTask: Task = {
      id: `task_${Date.now()}`,
      title,
      rewardAmount: amount,
      rewardType: type,
      customReward: type === 'custom' ? customReward : undefined,
      status: 'pending',
      endDate,
      createdAt: new Date().toISOString(),
      difficulty,
    };

    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.name === kidName) {
          return {
            ...kid,
            tasks: [...(kid.tasks || []), newTask],
          };
        }
        return kid;
      })
    );

    try {
      await supabase.from('kid_tasks').insert({
        title: type === 'custom' ? `${title} (المكافأة: ${customReward})` : title,
        reward_amount: amount,
        reward_type: type,
        status: 'pending',
        kid_name: kidName,
        end_date: endDate || null,
        difficulty: difficulty || null
      });
    } catch (err) {
      console.error('Failed to sync manual task to Supabase:', err);
    }
  };

  const calculateROI = (investedAmount: number, roiPercentage: number): number => {
    return investedAmount + (investedAmount * (roiPercentage / 100));
  };

  const updateKidLevels = async (kidId: string, bank: number, farm: number, market: number, tasks: number) => {
    // Update local state first
    setKids((prevKids) =>
      prevKids.map((k) => {
        if (k.id === kidId) {
          return {
            ...k,
            bank_level: bank,
            farm_level: farm,
            market_level: market,
            tasks_level: tasks,
          };
        }
        return k;
      })
    );

    // Sync to Supabase
    try {
      await supabase
        .from('kids_profiles')
        .update({
          bank_level: bank,
          farm_level: farm,
          market_level: market,
          tasks_level: tasks,
        })
        .eq('id', kidId);
      showToast('تم حفظ مستويات القرية ثلاثية الأبعاد بنجاح! 🏰💾', 'success');
    } catch (err) {
      console.error('Failed to sync kid levels to Supabase:', err);
      showToast('حدث خطأ أثناء حفظ مستويات القرية.', 'error');
    }
  };

  const runCleanup = async () => {
    try {
      // 1. Delete tasks from Supabase where status is 'approved' or 'failed' or 'expired'
      const { error: taskError } = await supabase
        .from('kid_tasks')
        .delete()
        .in('status', ['approved', 'failed', 'expired']);
      
      if (taskError) throw taskError;

      // 2. Delete notifications from Supabase
      const { error: notifError } = await supabase
        .from('notifications')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (notifError) throw notifError;

      // 3. Refresh local state
      await fetchData();
    } catch (err) {
      console.error('Failed to run cleanup in Supabase:', err);
    }
  };

  useEffect(() => {
    checkSavingsStatus();
    const interval = setInterval(checkSavingsStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const kidsWithDynamicSaved = kids.map((kid) => {
    const totalSavedFromGoals = (kid.savingsGoals || []).reduce((sum, goal) => sum + goal.currentAmount, 0);
    return {
      ...kid,
      saved: totalSavedFromGoals,
    };
  });

  return (
    <AppContext.Provider
      value={{
        profile,
        kids: kidsWithDynamicSaved,
        projects,
        setProfile,
        addDonation,
        approveTask,
        addProject,
        deleteProject,
        investInProject,
        addSavingsGoal,
        addToGoal,
        withdrawGoal,
        submitTaskProof,
        transferMoney,
        finalizeTaskApproval,
        logout,
        assignManualTask,
        calculateROI,
        updateKidLevels,
        geminiApiKey,
        setGeminiApiKey,
        notifications,
        addNotification,
        markNotificationAsRead,
        runCleanup,
        activeLeague,
        startFamilyLeague,
        endFamilyLeague,
        calculateKidScores,
        transferAllowance,
        simulateDailyPurchase,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
