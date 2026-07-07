import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockFamilyData } from '../data/mockData';
import type { Kid, FamilyProject, Task, Transaction } from '../data/mockData';

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
  approveTask: (kidId: string, taskTitle: string, rewardAmount: number, rewardType: 'cash' | 'points' | 'custom', customReward?: string) => void;
  addProject: (title: string, totalRequired: number, roiPercentage: number) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const savedProfile = localStorage.getItem('namaa_profile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const [kids, setKids] = useState<Kid[]>(() => {
    const savedKids = localStorage.getItem('namaa_kids');
    return savedKids ? JSON.parse(savedKids) : mockFamilyData.kids;
  });

  const [projects, setProjects] = useState<FamilyProject[]>(() => {
    const savedProjects = localStorage.getItem('namaa_projects');
    return savedProjects ? JSON.parse(savedProjects) : mockFamilyData.projects;
  });

  useEffect(() => {
    localStorage.setItem('namaa_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('namaa_kids', JSON.stringify(kids));
  }, [kids]);

  useEffect(() => {
    localStorage.setItem('namaa_projects', JSON.stringify(projects));
  }, [projects]);

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

  const approveTask = (
    kidId: string,
    taskTitle: string,
    rewardAmount: number,
    rewardType: 'cash' | 'points' | 'custom',
    customReward?: string
  ) => {
    setKids((prevKids) =>
      prevKids.map((kid) => {
        if (kid.id === kidId) {
          const newTask: Task = {
            id: `task_${Date.now()}`,
            title: taskTitle,
            rewardAmount,
            rewardType,
            customReward,
            status: 'pending',
          };
          return {
            ...kid,
            tasks: [...(kid.tasks || []), newTask],
          };
        }
        return kid;
      })
    );
  };

  const addProject = (title: string, totalRequired: number, roiPercentage: number) => {
    const newProj: FamilyProject = {
      id: `project_${Date.now()}`,
      title,
      totalRequired,
      currentInvested: 0,
      roiPercentage,
    };
    setProjects((prevProj) => [newProj, ...prevProj]);
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
