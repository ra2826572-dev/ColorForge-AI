import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  User as UserIcon,
  LogOut,
  Settings as SettingsIcon,
  Crown,
  LayoutTemplate,
  Palette,
  FolderKanban,
  History,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  isLanding?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isLanding = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, setActiveTab } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/login', { replace: true });
  };

  const currentPath = location.pathname;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          to={user ? '/dashboard' : '/'}
          className="group flex items-center gap-2 text-left focus:outline-none"
        >
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
            ColorForge AI
          </span>
          <span className="text-[10px] font-mono text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded">
            STUDIO
          </span>
        </Link>

        {/* Navigation Links */}
        {isLanding && !user ? (
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="hover:text-white transition-colors">AI Color System</a>
            <a href="#preview" className="hover:text-white transition-colors">Live Preview</a>
            <a href="#accessibility" className="hover:text-white transition-colors">Accessibility</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <Link
              to="/dashboard"
              onClick={() => setActiveTab('overview')}
              className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                currentPath === '/dashboard' ? 'text-white font-bold' : ''
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/generator"
              onClick={() => setActiveTab('generator')}
              className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                currentPath === '/generator' || currentPath === '/palette' ? 'text-white font-bold' : ''
              }`}
            >
              <Palette className="h-3.5 w-3.5" />
              <span>Color Generator</span>
            </Link>

            <Link
              to="/studio"
              onClick={() => setActiveTab('layout-generator')}
              className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                currentPath === '/studio' || currentPath === '/layout-generator' ? 'text-indigo-400 font-bold' : ''
              }`}
            >
              <LayoutTemplate className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-indigo-300">AI Website Layout</span>
            </Link>

            <Link
              to="/projects"
              onClick={() => setActiveTab('projects')}
              className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                currentPath === '/projects' ? 'text-white font-bold' : ''
              }`}
            >
              <FolderKanban className="h-3.5 w-3.5" />
              <span>Projects</span>
            </Link>

            <Link
              to="/history"
              onClick={() => setActiveTab('history')}
              className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                currentPath === '/history' ? 'text-white font-bold' : ''
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>History</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setActiveTab('settings')}
              className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                currentPath === '/settings' ? 'text-white font-bold' : ''
              }`}
            >
              <SettingsIcon className="h-3.5 w-3.5" />
              <span>Settings</span>
            </Link>
          </nav>
        )}

        {/* Right Actions & User Profile */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-700 transition-colors focus:outline-none shadow-sm"
              >
                <img
                  src={user.avatar || '/src/assets/images/avatar_designer_user_1791282031801.jpg'}
                  alt={user.username || user.name}
                  className="h-6 w-6 rounded-lg object-cover"
                />
                <span className="hidden sm:inline-block max-w-[120px] truncate font-semibold">
                  {user.username || user.name}
                </span>
                {user.plan === 'pro' ? (
                  <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold font-mono bg-amber-950/60 border border-amber-500/30 px-1 py-0.5 rounded">
                    PRO
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono bg-slate-800 px-1 py-0.5 rounded">
                    FREE
                  </span>
                )}
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {profileOpen && (
                <div
                  onMouseLeave={() => setProfileOpen(false)}
                  className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-2.5 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">{user.username || user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate font-mono mt-0.5">{user.email}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/80">
                      <span>Monthly Quota</span>
                      <span className="font-mono text-white font-bold">
                        {user.aiGenerationsUsed ?? user.generationsUsed ?? 0} / {user.plan === 'pro' ? '∞' : (user.maxAiGenerations ?? 10)}
                      </span>
                    </div>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <UserIcon className="h-3.5 w-3.5 text-indigo-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => {
                        setActiveTab('settings');
                        setProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <SettingsIcon className="h-3.5 w-3.5" />
                      <span>Settings</span>
                    </Link>

                    {user.plan === 'free' && (
                      <Link
                        to="/settings"
                        onClick={() => {
                          setActiveTab('pricing');
                          setProfileOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-amber-300 hover:bg-amber-950/30 transition-colors"
                      >
                        <Crown className="h-3.5 w-3.5 text-amber-400" />
                        <span>Upgrade to Pro</span>
                      </Link>
                    )}

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors whitespace-nowrap shadow-sm shadow-indigo-600/20"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
