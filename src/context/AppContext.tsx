import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockFamilyData } from '../data/mockData';
import type { Kid, FamilyProject, Task, Transaction, SavingsGoal } from '../data/mockData';
import { supabase } from '../utils/supabaseClient';

export interface UserProfile {
  name: string;
  role: 'father' | 'kid' | 'dev';
  email?: string;
}

interface AppContextType {
  profile: UserProfile | null;
  kids: Kid[];
  projects: FamilyProject[];
  setProfile: (profile: UserProfile | null) => void;
  addDonation: (kidId: string, amount: number) => Promise<void>;
  approveTask: (kidId: string, taskTitle: string, rewardAmount: number, rewardType: 'cash' | 'points' | 'custom', customReward?: string) => Promise<void>;
  addProject: (title: string, totalRequired: number, roiPercentage: number) => Promise<void>;
  investInProject: (kidName: string, projectId: string, amount: number) => Promise<void>;
  addSavingsGoal: (kidName: string, title: string, targetAmount: number, deadlineDate?: string) => void;
  addToGoal: (kidName: string, goalId: string, amount: number) => Promise<void>;
  withdrawGoal: (kidName: string, goalId: string) => Promise<void>;
  submitTaskProof: (taskId: string) => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const savedProfile = localStorage.getItem('namaa_profile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const [kids, setKids] = useState<Kid[]>(() => {
    const savedKids = localStorage.getItem('namaa_kids_v14');
    return savedKids ? JSON.parse(savedKids) : mockFamilyData.kids;
  });
  
  const [projects, setProjects] = useState<FamilyProject[]>(() => {
    const savedProjects = localStorage.getItem('namaa_projects_v14');
    return savedProjects ? JSON.parse(savedProjects) : mockFamilyData.projects;
  });

  useEffect(() => {
    localStorage.setItem('namaa_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('namaa_kids_v14', JSON.stringify(kids));
  }, [kids]);

  useEffect(() => {
    localStorage.setItem('namaa_projects_v14', JSON.stringify(projects));
  }, [projects]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch kids profiles from Supabase first
        const { data: dbKids, error: kidsError } = await supabase
          .from('kids_profiles')
          .select('*');

        if (!kidsError && dbKids && dbKids.length > 0) {
          setKids((prevKids) =>
            dbKids.map((k: any) => {
              const prevKid = prevKids.find(pk => pk.id === k.id) || mockFamilyData.kids.find(lk => lk.id === k.id) || mockFamilyData.kids[0];
              return {
                ...prevKid,
                id: k.id,
                name: k.name,
                age: k.age || prevKid.age,
                saved: k.saved || 0,
                balance: k.balance || 0,
                donationPoints: k.donation_points || 0,
              };
            })
          );
        }

        // 2. Fetch family projects from Supabase
        const { data: dbProjects, error: projError } = await supabase
          .from('family_projects')
          .select('*');

        if (!projError && dbProjects && dbProjects.length > 0) {
          const mappedProjects: FamilyProject[] = dbProjects.map((p: any) => ({
            id: p.id?.toString() || `project_${Date.now()}_${Math.random()}`,
            title: p.title,
            totalRequired: p.total_required,
            currentInvested: p.current_invested || 0,
            roiPercentage: p.roi_percentage,
          }));
          setProjects(mappedProjects);
        }

        // 3. Fetch kid tasks from Supabase
        const { data: dbTasks, error: taskError } = await supabase
          .from('kid_tasks')
          .select('*');

        if (!taskError && dbTasks) {
          setKids((prevKids) =>
            prevKids.map((kid) => {
              const kidDbTasks = dbTasks.filter((t: any) => t.kid_name === kid.name);
              const mappedTasks: Task[] = mappedTasksFromDb(kidDbTasks);
              return {
                ...kid,
                tasks: mappedTasks,
              };
            })
          );
        }
      } catch (err) {
        console.error('Error fetching data from Supabase:', err);
      }
    };

    fetchData();
  }, []);

  const mappedTasksFromDb = (dbTasks: any[]): Task[] => {
    return dbTasks.map((t: any) => ({
      id: t.id?.toString() || `task_${Date.now()}_${Math.random()}`,
      title: t.title,
      rewardAmount: t.reward_amount,
      rewardType: t.reward_type,
      customReward: t.reward_type === 'custom' ? t.title : undefined,
      status: (t.status as 'pending' | 'under_review' | 'completed' | 'approved') || 'pending',
    }));
  };

  const setProfile = (newProfile: UserProfile | null) => {
    setProfileState(newProfile);
  };

  const logout = () => {
    setProfileState(null);
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
          const newTx: Transaction = {
            id: `tx_${Date.now()}`,
            title: `تبرع للمسؤولية المجتمعية 💚`,
            amount: amount,
            type: 'withdrawal',
            date: new Date().toISOString().split('T')[0],
          };
          return {
            ...kid,
            balance: updatedBalance,
            donationPoints: newPoints,
            transactions: [newTx, ...kid.transactions],
          };
        }
        return kid;
      })
    );

    // Supabase Update
    try {
      await supabase
        .from('kids_profiles')
        .update({ balance: updatedBalance, donation_points: newPoints })
        .eq('id', kidId);
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
    };
    setProjects((prevProj) => [newProj, ...prevProj]);

    try {
      await supabase.from('family_projects').insert({
        title,
        total_required: totalRequired,
        current_invested: 0,
        roi_percentage: roiPercentage
      });
    } catch (err) {
      console.error('Failed to sync added project to Supabase:', err);
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

    setProjects((prevProj) =>
      prevProj.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            currentInvested: newInvestedAmount,
          };
        }
        return proj;
      })
    );

    // c. Update the specific kid's local state (subtract amount from balance)
    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.name === kidName) {
          const newTx: Transaction = {
            id: `tx_invest_${Date.now()}`,
            title: `مساهمة استثمارية عائلية 📈`,
            amount: amount,
            type: 'withdrawal',
            date: new Date().toISOString().split('T')[0],
          };
          return {
            ...kid,
            balance: updatedBalance,
            transactions: [newTx, ...(kid.transactions || [])],
          };
        }
        return kid;
      })
    );

    // b. Supabase Call
    try {
      await Promise.all([
        supabase
          .from('family_projects')
          .update({ current_invested: newInvestedAmount })
          .eq('id', projectId),
        supabase
          .from('kids_profiles')
          .update({ balance: updatedBalance })
          .eq('id', kidId)
      ]);
    } catch (err) {
      console.error('Failed to update project investment in Supabase:', err);
    }
  };

  const addSavingsGoal = (kidName: string, title: string, targetAmount: number, deadlineDate?: string) => {
    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.name === kidName) {
          const newGoal: SavingsGoal = {
            id: `goal_${Date.now()}`,
            title,
            targetAmount,
            currentAmount: 0,
            isLocked: true,
            deadlineDate,
          };
          return {
            ...kid,
            savingsGoals: [...(kid.savingsGoals || []), newGoal],
          };
        }
        return kid;
      })
    );
  };

  const addToGoal = async (kidName: string, goalId: string, amount: number) => {
    const targetKid = kids.find((k) => k.name === kidName);
    if (!targetKid || targetKid.balance < amount) return;

    const kidId = targetKid.id;
    const updatedBalance = Math.max(0, targetKid.balance - amount);

    // Local Update
    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.name === kidName) {
          const newTx: Transaction = {
            id: `tx_goal_${Date.now()}`,
            title: `إيداع في حصالة الادخار 🔒`,
            amount,
            type: 'withdrawal',
            date: new Date().toISOString().split('T')[0],
          };

          const updatedGoals = (kid.savingsGoals || []).map((goal) => {
            if (goal.id === goalId) {
              const newCurrent = goal.currentAmount + amount;
              return {
                ...goal,
                currentAmount: newCurrent,
                isLocked: newCurrent < goal.targetAmount,
              };
            }
            return goal;
          });

          return {
            ...kid,
            balance: updatedBalance,
            savingsGoals: updatedGoals,
            transactions: [newTx, ...(kid.transactions || [])],
          };
        }
        return kid;
      })
    );

    // Supabase Update
    try {
      await supabase
        .from('kids_profiles')
        .update({ balance: updatedBalance })
        .eq('id', kidId);
    } catch (err) {
      console.error('Failed to update kid balance in Supabase:', err);
    }
  };

  const withdrawGoal = async (kidName: string, goalId: string) => {
    const targetKid = kids.find((k) => k.name === kidName);
    if (!targetKid) return;

    const goal = (targetKid.savingsGoals || []).find((g) => g.id === goalId);
    if (!goal || goal.isLocked) return;

    const kidId = targetKid.id;
    const amountToWithdraw = goal.currentAmount;
    const updatedBalance = targetKid.balance + amountToWithdraw;

    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.name === kidName) {
          const newTx: Transaction = {
            id: `tx_withdraw_goal_${Date.now()}`,
            title: `سحب مدخرات حصالة: ${goal.title} 🔓🎉`,
            amount: amountToWithdraw,
            type: 'deposit',
            date: new Date().toISOString().split('T')[0],
          };

          const updatedGoals = (kid.savingsGoals || []).filter((g) => g.id !== goalId);

          return {
            ...kid,
            balance: updatedBalance,
            savingsGoals: updatedGoals,
            transactions: [newTx, ...(kid.transactions || [])],
          };
        }
        return kid;
      })
    );

    // Supabase Update
    try {
      await supabase
        .from('kids_profiles')
        .update({ balance: updatedBalance })
        .eq('id', kidId);
    } catch (err) {
      console.error('Failed to update kid balance in Supabase:', err);
    }
  };

  const submitTaskProof = async (taskId: string) => {
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

          if (goal.isLocked && (isTargetAchieved || isDeadlinePassed)) {
            kidChanged = true;
            changed = true;
            addedBalance += goal.currentAmount;

            const autoTx: Transaction = {
              id: `tx_auto_unlock_${Date.now()}_${Math.random()}`,
              title: `استحقاق حصالة: ${goal.title} 💰`,
              amount: goal.currentAmount,
              type: 'deposit',
              date: new Date().toISOString().split('T')[0],
            };
            newTransactions.push(autoTx);
            return false; // Deletes the goal
          }
          return true; // Keeps the goal
        });

        if (kidChanged) {
          const newBalance = kid.balance + addedBalance;
          
          // Sync this change to Supabase asynchronously
          supabase
            .from('kids_profiles')
            .update({ balance: newBalance })
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

  useEffect(() => {
    checkSavingsStatus();
    const interval = setInterval(checkSavingsStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider
      value={{
        profile,
        kids,
        projects,
        setProfile,
        addDonation,
        approveTask,
        addProject,
        investInProject,
        addSavingsGoal,
        addToGoal,
        withdrawGoal,
        submitTaskProof,
        logout,
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
