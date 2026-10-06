import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorAnalysisResult, ColorSystem, GenerationHistoryItem, Project, User } from '../types/colorforge';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSystem: ColorSystem | null;
  setActiveSystem: (system: ColorSystem | null) => void;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  history: GenerationHistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<GenerationHistoryItem[]>>;
  refreshData: () => Promise<void>;
  saveCurrentProject: (projectName?: string) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<void>;
  toggleFavoriteProject: (id: string) => Promise<void>;
  deleteHistoryItem: (id: string) => Promise<void>;
  upgradePlan: (plan: 'free' | 'pro') => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;
  exportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cf_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default demo user for instant interactive exploration
    return {
      id: 'user_demo_1',
      name: 'Alex Vance',
      email: 'alex.vance@studio.design',
      avatar: '/src/assets/images/avatar_designer_user_1791282031801.jpg',
      plan: 'free',
      generationsUsed: 3,
      maxFreeGenerations: 5,
      createdAt: new Date().toISOString(),
    };
  });

  const [activeTab, setActiveTab] = useState<string>('landing');
  const [activeSystem, setActiveSystem] = useState<ColorSystem | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('cf_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cf_user');
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const refreshData = async () => {
    try {
      const pRes = await fetch(`/api/projects?userId=${user?.id || 'user_demo_1'}`);
      if (pRes.ok) {
        const pData = await pRes.json();
        setProjects(pData.projects || []);
        if (!activeSystem && pData.projects?.length > 0) {
          setActiveSystem(pData.projects[0].colorSystem);
        }
      }
      const hRes = await fetch(`/api/history?userId=${user?.id || 'user_demo_1'}`);
      if (hRes.ok) {
        const hData = await hRes.json();
        setHistory(hData.history || []);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user?.id]);

  const saveCurrentProject = async (projectName?: string): Promise<Project | null> => {
    if (!activeSystem) return null;
    const name = projectName || `${activeSystem.websiteName} Palette`;

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'user_demo_1',
          projectName: name,
          websiteName: activeSystem.websiteName,
          category: activeSystem.category,
          description: activeSystem.description,
          targetAudience: activeSystem.targetAudience,
          style: activeSystem.style,
          themePreference: activeSystem.themePreference,
          colorSystem: activeSystem,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(prev => [data.project, ...prev]);
        showToast('Project saved successfully to your workspace');
        return data.project;
      }
    } catch (e) {
      console.error('Failed to save project', e);
      showToast('Error saving project');
    }
    return null;
  };

  const deleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
        showToast('Project removed');
      }
    } catch (e) {
      console.error(e);
      showToast('Error deleting project');
    }
  };

  const duplicateProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setProjects(prev => [data.project, ...prev]);
        showToast('Project duplicated');
      }
    } catch (e) {
      console.error(e);
      showToast('Error duplicating project');
    }
  };

  const toggleFavoriteProject = async (id: string) => {
    const proj = projects.find(p => p.id === id);
    if (!proj) return;
    const newFav = !proj.isFavorite;

    // Optimistic update
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, isFavorite: newFav } : p)));

    try {
      await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: newFav }),
      });
      showToast(newFav ? 'Added to favorites' : 'Removed from favorites');
    } catch (e) {
      console.error(e);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHistory(prev => prev.filter(h => h.id !== id));
        showToast('History entry deleted');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const upgradePlan = async (plan: 'free' | 'pro') => {
    if (!user) return;
    try {
      const res = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, plan }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        showToast(`Upgraded to ${plan.toUpperCase()} Plan! Enjoy unlimited generations.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        activeTab,
        setActiveTab,
        activeSystem,
        setActiveSystem,
        projects,
        setProjects,
        history,
        setHistory,
        refreshData,
        saveCurrentProject,
        deleteProject,
        duplicateProject,
        toggleFavoriteProject,
        deleteHistoryItem,
        upgradePlan,
        toastMessage,
        showToast,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        exportModalOpen,
        setExportModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
