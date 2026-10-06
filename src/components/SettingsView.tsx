import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User as UserIcon, Shield, Sun, Bell, CreditCard, Database, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, setUser, showToast, upgradePlan } = useApp();
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'appearance' | 'notifications' | 'subscription' | 'data'>('profile');

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Appearance state
  const [appearanceTheme, setAppearanceTheme] = useState<'dark' | 'light' | 'system'>('dark');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name, email }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser({
          ...data.user,
          username: name,
        });
        showToast('Username & Profile updated successfully');
      }
    } catch (e) {
      console.error(e);
      showToast('Error updating profile');
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters');
      return;
    }
    showToast('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Configuration</span>
        <h1 className="text-2xl font-bold text-white mt-1">Workspace Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your account profile, appearance defaults, subscription plan, and security controls.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-60 space-y-1">
          {[
            { id: 'profile', label: 'Profile', icon: UserIcon },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'appearance', label: 'Appearance', icon: Sun },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'subscription', label: 'Subscription', icon: CreditCard },
            { id: 'data', label: 'Data & Privacy', icon: Database },
          ].map(sec => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                  activeSection === sec.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/90 p-7 shadow-xl">
          {activeSection === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5 max-w-lg">
              <h3 className="text-sm font-bold text-white">Profile Details</h3>

              <div className="flex items-center gap-4">
                <img
                  src={user?.avatar || '/src/assets/images/avatar_designer_user_1791282031801.jpg'}
                  alt={user?.name}
                  className="h-16 w-16 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <p className="text-xs font-semibold text-white">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{user?.email}</p>
                  <p className="text-[10px] text-indigo-400 font-mono mt-1 uppercase">
                    Plan: {user?.plan}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </form>
          )}

          {activeSection === 'security' && (
            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
              <h3 className="text-sm font-bold text-white">Password & Authentication</h3>
              <p className="text-xs text-slate-400">
                Update your account password to maintain administrative isolation.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Update Password
              </button>
            </form>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-4 max-w-lg">
              <h3 className="text-sm font-bold text-white">Appearance & Theme Defaults</h3>
              <p className="text-xs text-slate-400">
                Select your preferred studio editor interface appearance.
              </p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'dark', label: 'Dark Void' },
                  { id: 'light', label: 'Pure Light' },
                  { id: 'system', label: 'System Default' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAppearanceTheme(opt.id as any);
                      showToast(`Appearance preference set to ${opt.label}`);
                    }}
                    className={`rounded-xl border p-4 text-xs font-semibold text-center transition-colors ${
                      appearanceTheme === opt.id
                        ? 'border-indigo-500 bg-indigo-950/40 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-4 max-w-lg">
              <h3 className="text-sm font-bold text-white">Email & Notification Preferences</h3>
              <div className="space-y-3 text-xs text-slate-300">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950" />
                  <span>Notify when generation quota is approaching monthly threshold</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950" />
                  <span>Monthly design systems digest & color theory updates</span>
                </label>
              </div>
            </div>
          )}

          {activeSection === 'subscription' && (
            <div className="space-y-4 max-w-lg">
              <h3 className="text-sm font-bold text-white">Current Subscription</h3>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Plan:</span>
                  <span className="font-bold text-white uppercase font-mono">{user?.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Monthly Usage:</span>
                  <span className="font-mono text-slate-200">
                    {user?.generationsUsed} / {user?.plan === 'pro' ? 'Unlimited' : user?.maxFreeGenerations}
                  </span>
                </div>
              </div>

              {user?.plan === 'free' ? (
                <button
                  onClick={() => upgradePlan('pro')}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  Upgrade to Pro ($29/mo)
                </button>
              ) : (
                <button
                  onClick={() => upgradePlan('free')}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Switch to Free
                </button>
              )}
            </div>
          )}

          {activeSection === 'data' && (
            <div className="space-y-4 max-w-lg">
              <h3 className="text-sm font-bold text-white">Data & Privacy Governance</h3>
              <p className="text-xs text-slate-400">
                Your color palettes and project entities are isolated strictly to your account.
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => showToast('Full workspace JSON archive exported')}
                  className="w-fit rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Download Complete Workspace Data (JSON)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
