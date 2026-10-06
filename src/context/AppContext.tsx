import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ColorSystem, GenerationHistoryItem, Project, User } from '../types/colorforge';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  authLoading: boolean;
  dataLoading: boolean;
  dataError: string | null;
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
  logout: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot' | 'username_setup';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot' | 'username_setup') => void;
  exportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [user, setUserState] = useState<User | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeSystem, setActiveSystem] = useState<ColorSystem | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot' | 'username_setup'>('login');
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);

  // Initialize Auth state from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cf_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) {
          setUserState(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved user credentials', e);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('cf_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('cf_user');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('cf_user');
    setProjects([]);
    setHistory([]);
    setActiveSystem(null);
    setToastMessage('Signed out successfully');
  }, [setUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const refreshData = useCallback(async () => {
    if (!user) {
      return;
    }

    setDataLoading(true);
    setDataError(null);

    try {
      const pRes = await fetch(`/api/projects?userId=${encodeURIComponent(user.id)}`);
      if (pRes.ok) {
        const pData = await pRes.json();
        const loadedProjects: Project[] = Array.isArray(pData.projects) ? pData.projects : [];
        setProjects(loadedProjects);

        if (!activeSystem && loadedProjects.length > 0 && loadedProjects[0].colorSystem) {
          setActiveSystem(loadedProjects[0].colorSystem);
        }
      } else {
        throw new Error(`Failed to load projects: ${pRes.statusText}`);
      }

      const hRes = await fetch(`/api/history?userId=${encodeURIComponent(user.id)}`);
      if (hRes.ok) {
        const hData = await hRes.json();
        setHistory(Array.isArray(hData.history) ? hData.history : []);
      }
    } catch (err: any) {
      console.error('Failed to fetch user workspace data', err);
      setDataError(err.message || 'Something went wrong while loading your workspace.');
    } finally {
      setDataLoading(false);
    }
  }, [user, activeSystem]);

  useEffect(() => {
    if (user?.id) {
      refreshData();
    }
  }, [user?.id, refreshData]);

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
        showToast(`Upgraded to ${plan.toUpperCase()} Plan! Unlimited generations unlocked.`);
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
        authLoading,
        dataLoading,
        dataError,
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
        logout,
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
