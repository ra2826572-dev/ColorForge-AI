import React, { useState } from 'react';
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
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  Bookmark,
  Sparkles,
  Pipette,
  History as HistoryIcon,
  Star,
  CreditCard,
  Settings as SettingsIcon,
  Crown,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, activeTab, setActiveTab, activeSystem, setAuthModalOpen, setAuthModalMode } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If user is null, enforce protected view or show prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center space-y-4 shadow-2xl">
          <Sparkles className="mx-auto h-8 w-8 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Protected Workspace</h2>
          <p className="text-xs text-slate-400">
            Please sign in to access your projects, dashboard analytics, and AI color generator.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setAuthModalOpen(true);
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Sign In to Continue
            </button>
            <button
              onClick={() => setActiveTab('landing')}
              className="w-full py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
            >
              Back to Landing Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sidebarNavItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generator', label: 'New Color System', icon: PlusCircle, highlight: true },
    { id: 'projects', label: 'My Projects', icon: FolderKanban },
    { id: 'palette', label: 'Active Palette', icon: Sparkles, disabled: !activeSystem },
    { id: 'analyzer', label: 'Color Analyzer', icon: Pipette },
    { id: 'history', label: 'History', icon: HistoryIcon },
    { id: 'pricing', label: 'Pricing & Limits', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileSidebarOpen(false);
  };

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
              Navigation
            </div>

            {sidebarNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              if (item.disabled) return null;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : item.highlight
                      ? 'text-indigo-300 hover:bg-slate-800/80 hover:text-white'
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
          <div className="p-4 border-t border-slate-800/80 space-y-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Monthly Quota</span>
                <span className="font-mono text-[11px] text-slate-400">
                  {user.generationsUsed} / {user.plan === 'pro' ? '∞' : user.maxFreeGenerations}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{
                    width: user.plan === 'pro' ? '100%' : `${Math.min(100, (user.generationsUsed / user.maxFreeGenerations) * 100)}%`,
                  }}
                />
              </div>

              <p className="text-[10px] text-slate-400">
                {user.plan === 'pro' ? 'Unlimited Pro Access' : `${user.maxFreeGenerations - user.generationsUsed} free generations remaining`}
              </p>
            </div>

            {user.plan === 'free' && (
              <button
                onClick={() => handleNavClick('pricing')}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-950/20 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-950/40 transition-colors"
              >
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                Upgrade to Pro
              </button>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {activeTab === 'overview' && <OverviewView />}
          {activeTab === 'generator' && <GeneratorWizard />}
          {activeTab === 'palette' && activeSystem && <PaletteDetailView system={activeSystem} />}
          {activeTab === 'palette' && !activeSystem && <GeneratorWizard />}
          {activeTab === 'projects' && <ProjectsView />}
          {activeTab === 'analyzer' && <ColorAnalyzerView />}
          {activeTab === 'history' && <HistoryView />}
          {activeTab === 'pricing' && <PricingView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};
