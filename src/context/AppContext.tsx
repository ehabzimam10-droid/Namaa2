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
  addSavingsGoal: (kidName: string, title: string, targetAmount: number, deadlineDate?: string) => Promise<void>;
  addToGoal: (kidName: string, goalId: string, amount: number) => Promise<void>;
  withdrawGoal: (kidName: string, goalId: string) => Promise<void>;
  submitTaskProof: (taskId: string) => Promise<void>;
  transferMoney: (kidId: string, amount: number, reason: string) => Promise<void>;
  finalizeTaskApproval: (taskId: string) => Promise<void>;
  logout: () => void;
  assignManualTask: (kidName: string, title: string, amount: number, type: 'cash' | 'points' | 'custom', customReward?: string) => Promise<void>;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
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

  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(() => {
    return localStorage.getItem('namaa_gemini_api_key') || '';
  });

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
    localStorage.setItem('namaa_gemini_api_key', key);
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

  // Fetch data on mount
  useEffect(() => {
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
              // Fix Khalid Bug: find kid in local state/mock by name since database ID is a UUID
              const prevKid = prevKids.find(pk => pk.name === k.name) || mockFamilyData.kids.find(lk => lk.name === k.name) || mockFamilyData.kids[0];
              
              // Map tasks
              const kidDbTasks = dbTasks ? dbTasks.filter((t: any) => t.kid_name === k.name) : [];
              const mappedTasks = mappedTasksFromDb(kidDbTasks);

              // Map goals
              const kidGoals = dbGoals ? dbGoals.filter((g: any) => g.kid_name === k.name) : [];
              const mappedGoals: SavingsGoal[] = kidGoals.map((g: any) => ({
                id: g.id?.toString(),
                title: g.title,
                targetAmount: g.target_amount,
                currentAmount: g.current_amount,
                isLocked: g.is_locked,
                deadlineDate: g.deadline_date || undefined
              }));

              // Map transactions
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
                transactions: mappedTx
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

  const logTransaction = async (kidName: string, title: string, amount: number, type: 'deposit' | 'withdrawal') => {
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

    const kidId = targetKid.id;
    const updatedBalance = Math.max(0, targetKid.balance - amount);

    // Local Update
    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.name === kidName) {
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
          };
        }
        return kid;
      })
    );

    // Supabase Update
    try {
      const computedSaved = (targetKid.savingsGoals || []).reduce((sum, goal) => {
        if (goal.id === goalId) {
          return sum + goal.currentAmount + amount;
        }
        return sum + goal.currentAmount;
      }, 0);

      const dbGoalId = isNaN(Number(goalId)) ? goalId : Number(goalId);
      const targetGoal = (targetKid.savingsGoals || []).find(g => g.id === goalId);
      const newCurrent = targetGoal ? targetGoal.currentAmount + amount : amount;
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

  const assignManualTask = async (
    kidName: string,
    title: string,
    amount: number,
    type: 'cash' | 'points' | 'custom',
    customReward?: string
  ) => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title,
      rewardAmount: amount,
      rewardType: type,
      customReward: type === 'custom' ? customReward : undefined,
      status: 'pending',
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
        kid_name: kidName
      });
    } catch (err) {
      console.error('Failed to sync manual task to Supabase:', err);
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
        investInProject,
        addSavingsGoal,
        addToGoal,
        withdrawGoal,
        submitTaskProof,
        transferMoney,
        finalizeTaskApproval,
        logout,
        assignManualTask,
        geminiApiKey,
        setGeminiApiKey,
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
