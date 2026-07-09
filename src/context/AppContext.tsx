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
  addDonation: (kidId: string, amount: number) => void;
  approveTask: (kidId: string, taskTitle: string, rewardAmount: number, rewardType: 'cash' | 'points' | 'custom', customReward?: string) => Promise<void>;
  addProject: (title: string, totalRequired: number, roiPercentage: number) => Promise<void>;
  investInProject: (kidName: string, projectId: string, amount: number) => Promise<void>;
  addSavingsGoal: (kidName: string, title: string, targetAmount: number) => void;
  addToGoal: (kidName: string, goalId: string, amount: number) => void;
  withdrawGoal: (kidName: string, goalId: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const savedProfile = localStorage.getItem('namaa_profile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const [kids, setKids] = useState<Kid[]>(() => {
    const savedKids = localStorage.getItem('namaa_kids_v10');
    return savedKids ? JSON.parse(savedKids) : mockFamilyData.kids;
  });
  
  const [projects, setProjects] = useState<FamilyProject[]>(() => {
    const savedProjects = localStorage.getItem('namaa_projects_v10');
    return savedProjects ? JSON.parse(savedProjects) : mockFamilyData.projects;
  });

  useEffect(() => {
    localStorage.setItem('namaa_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('namaa_kids_v10', JSON.stringify(kids));
  }, [kids]);

  useEffect(() => {
    localStorage.setItem('namaa_projects_v10', JSON.stringify(projects));
  }, [projects]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch family projects from Supabase
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

        // Fetch kid tasks from Supabase
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
      status: t.status || 'pending',
    }));
  };

  const setProfile = (newProfile: UserProfile | null) => {
    setProfileState(newProfile);
  };

  const logout = () => {
    setProfileState(null);
  };

  const addDonation = (kidId: string, amount: number) => {
    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.id === kidId) {
          const updatedSaved = Math.max(0, kid.saved - amount);
          const newTx: Transaction = {
            id: `tx_${Date.now()}`,
            title: `تبرع للمسؤولية المجتمعية 💚`,
            amount: amount,
            type: 'withdrawal',
            date: new Date().toISOString().split('T')[0],
          };
          return {
            ...kid,
            saved: updatedSaved,
            donationPoints: kid.donationPoints + amount,
            transactions: [newTx, ...kid.transactions],
          };
        }
        return kid;
      })
    );
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

    // c. Update the specific kid's local state (subtract amount from saved balance)
    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.name === kidName) {
          const updatedSaved = Math.max(0, kid.saved - amount);
          const newTx: Transaction = {
            id: `tx_invest_${Date.now()}`,
            title: `مساهمة استثمارية عائلية 📈`,
            amount: amount,
            type: 'withdrawal',
            date: new Date().toISOString().split('T')[0],
          };
          return {
            ...kid,
            saved: updatedSaved,
            transactions: [newTx, ...(kid.transactions || [])],
          };
        }
        return kid;
      })
    );

    // b. Supabase Call
    try {
      await supabase
        .from('family_projects')
        .update({ current_invested: newInvestedAmount })
        .eq('id', projectId);
    } catch (err) {
      console.error('Failed to update project investment in Supabase:', err);
    }
  };

  const addSavingsGoal = (kidName: string, title: string, targetAmount: number) => {
    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.name === kidName) {
          const newGoal: SavingsGoal = {
            id: `goal_${Date.now()}`,
            title,
            targetAmount,
            currentAmount: 0,
            isLocked: true,
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

  const addToGoal = (kidName: string, goalId: string, amount: number) => {
    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.name === kidName) {
          if (kid.saved < amount) return kid;

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
            saved: Math.max(0, kid.saved - amount),
            savingsGoals: updatedGoals,
            transactions: [newTx, ...(kid.transactions || [])],
          };
        }
        return kid;
      })
    );
  };

  const withdrawGoal = (kidName: string, goalId: string) => {
    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.name === kidName) {
          const goal = (kid.savingsGoals || []).find((g) => g.id === goalId);
          if (!goal || goal.isLocked) return kid;

          const amountToWithdraw = goal.currentAmount;

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
            saved: kid.saved + amountToWithdraw,
            savingsGoals: updatedGoals,
            transactions: [newTx, ...(kid.transactions || [])],
          };
        }
        return kid;
      })
    );
  };

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
