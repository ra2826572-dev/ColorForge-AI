import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User as UserIcon,
  Mail,
  Shield,
  Crown,
  Calendar,
  Sparkles,
  Zap,
  Save,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import { safeApiFetch } from '../utils/apiClient';

export const ProfileView: React.FC = () => {
  const { user, setUser, showToast, upgradePlan } = useApp();
  const [displayName, setDisplayName] = useState(user?.username || user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      showToast('Please enter a valid display name.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await safeApiFetch('/api/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          userId: user.id,
          name: displayName.trim(),
          username: displayName.trim(),
          email: email.trim() || user.email,
        }),
      });

      if (res.user) {
        setUser(res.user);
        showToast('Profile information updated successfully!');
      } else {
        setUser({
          ...user,
          name: displayName.trim(),
          username: displayName.trim(),
          email: email.trim() || user.email,
        });
        showToast('Profile updated locally.');
      }
    } catch (err: any) {
      showToast('Failed to update profile: ' + (err.message || 'Error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    try {
      const res = await safeApiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          email: user.email,
          newPassword,
        }),
      });

      if (res.success) {
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        showToast('Password updated securely.');
      } else {
        setPasswordError(res.error || 'Failed to update password.');
      }
    } catch (e: any) {
      setPasswordError(e.message || 'Error updating password.');
    }
  };

  const aiGenerationsUsed = user.aiGenerationsUsed ?? user.generationsUsed ?? 0;
  const maxAiGenerations = user.maxAiGenerations ?? 10;
  const palettesUsed = user.palettesUsed ?? 0;
  const maxPalettes = user.maxPalettes ?? 20;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar || '/src/assets/images/avatar_designer_user_1791282031801.jpg'}
              alt={user.name}
              className="w-16 h-16 rounded-2xl border-2 border-indigo-500/40 object-cover shadow-lg"
            />
            {user.plan === 'pro' && (
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase font-mono shadow">
                PRO
              </span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              {user.username || user.name}
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                <Calendar className="h-3 w-3 text-indigo-400" />
                Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase font-mono ${
                user.plan === 'pro' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {user.plan.toUpperCase()} Plan
              </span>
            </div>
          </div>
        </div>

        {user.plan === 'free' ? (
          <button
            onClick={() => upgradePlan('pro')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-slate-950 hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
          >
            <Crown className="h-4 w-4" />
            Upgrade to Pro ($19/mo)
          </button>
        ) : (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-3.5 py-2 text-xs text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Pro Membership Active</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Account Details & Edit */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <UserIcon className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Personal Information</h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Display / User Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="e.g. Rizwan, Alex Vance"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-colors shadow-md disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Password Security Form */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Lock className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Security & Password</h2>
            </div>

            {passwordSuccess && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Password has been updated successfully.
              </div>
            )}

            {passwordError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Shield className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Quotas & Subscription Details */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-indigo-400" />
              Usage & Monthly Quotas
            </h2>

            {/* AI Generations Gauge */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">AI Generations</span>
                <span className="font-mono font-bold text-white">
                  {aiGenerationsUsed} / {user.plan === 'pro' ? '∞' : maxAiGenerations}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{
                    width: user.plan === 'pro' ? '100%' : `${Math.min(100, (aiGenerationsUsed / maxAiGenerations) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Color Palettes Gauge */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Color Palettes</span>
                <span className="font-mono font-bold text-white">
                  {palettesUsed} / {user.plan === 'pro' ? '∞' : maxPalettes}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{
                    width: user.plan === 'pro' ? '100%' : `${Math.min(100, (palettesUsed / maxPalettes) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-800">
              {user.plan === 'pro'
                ? 'Your Pro subscription grants unrestricted access to all website layouts, export formats, and deep color intelligence.'
                : 'Free tier resets at the start of each billing cycle. Upgrade to Pro for unlimited generation power.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
