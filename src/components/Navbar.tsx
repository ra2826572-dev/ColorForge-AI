import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, User as UserIcon, LogOut, Settings as SettingsIcon, Crown } from 'lucide-react';

interface NavbarProps {
  isLanding?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isLanding = false }) => {
  const { user, setUser, activeTab, setActiveTab, setAuthModalOpen, setAuthModalMode, showToast } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setProfileOpen(false);
    setActiveTab('landing');
    showToast('Signed out successfully');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab(user ? 'overview' : 'landing')}
          className="group flex items-center gap-2 text-left focus:outline-none"
        >
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
            ColorForge AI
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        {isLanding ? (
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="hover:text-white transition-colors">AI Color System</a>
            <a href="#preview" className="hover:text-white transition-colors">Live Preview</a>
            <a href="#accessibility" className="hover:text-white transition-colors">Accessibility</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button
              onClick={() => setActiveTab('overview')}
              className={`hover:text-white transition-colors ${activeTab === 'overview' ? 'text-white font-semibold' : ''}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('layout-generator')}
              className={`hover:text-white transition-colors ${activeTab === 'layout-generator' ? 'text-indigo-400 font-semibold' : ''}`}
            >
              Layout Generator
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`hover:text-white transition-colors ${activeTab === 'generator' ? 'text-white font-semibold' : ''}`}
            >
              New System
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`hover:text-white transition-colors ${activeTab === 'projects' ? 'text-white font-semibold' : ''}`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`hover:text-white transition-colors ${activeTab === 'analyzer' ? 'text-white font-semibold' : ''}`}
            >
              Color Analyzer
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`hover:text-white transition-colors ${activeTab === 'pricing' ? 'text-white font-semibold' : ''}`}
            >
              Plans
            </button>
          </nav>
        )}

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {isLanding && (
                <button
                  onClick={() => setActiveTab('overview')}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm shadow-indigo-600/20"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Go to Dashboard</span>
                </button>
              )}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-700 transition-colors focus:outline-none"
                >
                <img
                  src={user.avatar || '/src/assets/images/avatar_designer_user_1791282031801.jpg'}
                  alt={user.username || user.name}
                  className="h-6 w-6 rounded-md object-cover"
                />
                <span className="hidden sm:inline-block max-w-[120px] truncate">{user.username || user.name}</span>
                {user.plan === 'pro' ? (
                  <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold font-mono">PRO</span>
                ) : (
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">FREE</span>
                )}
              </button>

              {profileOpen && (
                <div
                  onMouseLeave={() => setProfileOpen(false)}
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white truncate">{user.username || user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate font-mono">{user.email}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Generations</span>
                      <span className="font-mono text-slate-200">{user.generationsUsed} / {user.plan === 'pro' ? '∞' : user.maxFreeGenerations}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <SettingsIcon className="h-3.5 w-3.5" />
                      Settings & Profile
                    </button>
                    {user.plan === 'free' && (
                      <button
                        onClick={() => {
                          setActiveTab('pricing');
                          setProfileOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-amber-300 hover:bg-slate-800 transition-colors"
                      >
                        <Crown className="h-3.5 w-3.5" />
                        Upgrade to Pro
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors whitespace-nowrap shadow-sm shadow-indigo-600/20"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
