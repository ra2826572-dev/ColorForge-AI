import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from './Navbar';
import { OverviewView } from './OverviewView';
import { GeneratorWizard } from './GeneratorWizard';
import { PaletteDetailView } from './PaletteDetailView';
import { ProjectsView } from './ProjectsView';
import { HistoryView } from './HistoryView';
import { ColorAnalyzerView } from './ColorAnalyzerView';
import { PricingView } from './PricingView';
import { SettingsView } from './SettingsView';
import { ProfileView } from './ProfileView';
import { LayoutGeneratorView } from './layout-generator/LayoutGeneratorView';
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  Sparkles,
  Pipette,
  History as HistoryIcon,
  CreditCard,
  Settings as SettingsIcon,
  Crown,
  ChevronRight,
  Menu,
  X,
  LayoutTemplate,
  User as UserIcon,
} from 'lucide-react';

interface DashboardProps {
  initialTab?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ initialTab }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, activeTab, setActiveTab, activeSystem } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync route pathname with activeTab
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      return;
    }

    const path = location.pathname;
    if (path === '/studio' || path === '/layout-generator') {
      setActiveTab('layout-generator');
    } else if (path === '/generator') {
      setActiveTab('generator');
    } else if (path === '/palette') {
      setActiveTab('palette');
    } else if (path === '/projects') {
      setActiveTab('projects');
    } else if (path === '/history') {
      setActiveTab('history');
    } else if (path === '/settings') {
      setActiveTab('settings');
    } else if (path === '/profile') {
      setActiveTab('profile');
    } else if (path === '/analyzer') {
      setActiveTab('analyzer');
    } else if (path === '/pricing') {
      setActiveTab('pricing');
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname, initialTab, setActiveTab]);

  const sidebarNavItems = [
    { id: 'overview', path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'layout-generator', path: '/studio', label: 'AI Website Layout', icon: LayoutTemplate, highlight: true },
    { id: 'generator', path: '/generator', label: 'Color Generator', icon: PlusCircle },
    { id: 'projects', path: '/projects', label: 'My Projects', icon: FolderKanban },
    { id: 'palette', path: '/palette', label: 'Active Palette', icon: Sparkles, disabled: !activeSystem },
    { id: 'analyzer', path: '/analyzer', label: 'Color Analyzer', icon: Pipette },
    { id: 'history', path: '/history', label: 'History', icon: HistoryIcon },
    { id: 'profile', path: '/profile', label: 'My Profile', icon: UserIcon },
    { id: 'pricing', path: '/pricing', label: 'Pricing & Limits', icon: CreditCard },
    { id: 'settings', path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleNavClick = (item: typeof sidebarNavItems[0]) => {
    setActiveTab(item.id);
    navigate(item.path);
    setMobileSidebarOpen(false);
  };

  const currentTab = activeTab || 'overview';
  const aiGenerationsUsed = user?.aiGenerationsUsed ?? user?.generationsUsed ?? 0;
  const maxAiGenerations = user?.maxAiGenerations ?? 10;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar isLanding={false} />

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar Toggle Button */}
        <div className="md:hidden fixed bottom-4 left-4 z-40">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="flex items-center gap-2 rounded-full bg-indigo-600 p-3 text-white shadow-xl focus:outline-none"
          >
            {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Left Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 pt-16 md:pt-0 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Navigation Links */}
          <div className="p-4 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Workspace
            </div>

            {sidebarNavItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              if (item.disabled) return null;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                      : item.highlight
                      ? 'text-indigo-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3 w-3 text-white/70" />}
                </button>
              );
            })}
          </div>

          {/* Usage & Plan Card at Bottom of Sidebar */}
          {user && (
            <div className="p-4 border-t border-slate-800/80 space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Monthly Quota</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {aiGenerationsUsed} / {user.plan === 'pro' ? '∞' : maxAiGenerations}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{
                      width: user.plan === 'pro' ? '100%' : `${Math.min(100, (aiGenerationsUsed / maxAiGenerations) * 100)}%`,
                    }}
                  />
                </div>

                <p className="text-[10px] text-slate-400">
                  {user.plan === 'pro'
                    ? 'Unlimited Pro Plan'
                    : `${Math.max(0, maxAiGenerations - aiGenerationsUsed)} AI layouts remaining`}
                </p>
              </div>

              {user.plan === 'free' && (
                <button
                  onClick={() => {
                    setActiveTab('pricing');
                    navigate('/pricing');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-950/20 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-950/40 transition-colors"
                >
                  <Crown className="h-3.5 w-3.5 text-amber-400" />
                  <span>Upgrade to Pro</span>
                </button>
              )}
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {currentTab === 'overview' && <OverviewView />}
          {currentTab === 'layout-generator' && <LayoutGeneratorView />}
          {currentTab === 'generator' && <GeneratorWizard />}
          {currentTab === 'palette' && activeSystem && <PaletteDetailView system={activeSystem} />}
          {currentTab === 'palette' && !activeSystem && <GeneratorWizard />}
          {currentTab === 'projects' && <ProjectsView />}
          {currentTab === 'analyzer' && <ColorAnalyzerView />}
          {currentTab === 'history' && <HistoryView />}
          {currentTab === 'profile' && <ProfileView />}
          {currentTab === 'pricing' && <PricingView />}
          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};
