import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Check,
  UserCheck,
} from 'lucide-react';
import { registerAccount, loginAccount, safeApiFetch } from '../utils/apiClient';
import { User } from '../types/colorforge';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    setUser,
    showToast,
    setActiveTab,
  } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Pending user between Login and Username Setup
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [customUsername, setCustomUsername] = useState<string>('');

  if (!authModalOpen) return null;

  // Step 1: Handle Login or Register submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (authModalMode === 'register') {
      if (!cleanName) {
        setError('Please enter your full name.');
        return;
      }
      if (!cleanEmail) {
        setError('Please enter your email address.');
        return;
      }
      if (!emailRegex.test(cleanEmail)) {
        setError('Please enter a valid email address (e.g. name@company.com).');
        return;
      }
      if (!password) {
        setError('Please enter a password.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter your password.');
        return;
      }

      setLoading(true);
      try {
        const result = await registerAccount(cleanName, cleanEmail, password);
        if (!result.success || !result.user) {
          setError(result.error || 'Registration failed. Please try again.');
          return;
        }

        // Move to Step 2: Add / Confirm Username
        setPendingUser(result.user);
        setCustomUsername(cleanName || cleanEmail.split('@')[0]);
        setAuthModalMode('username_setup');
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred during signup.');
      } finally {
        setLoading(false);
      }
    } else if (authModalMode === 'login') {
      if (!cleanEmail) {
        setError('Please enter your email address.');
        return;
      }
      if (!password) {
        setError('Please enter your password.');
        return;
      }

      setLoading(true);
      try {
        const result = await loginAccount(cleanEmail, password);
        if (!result.success || !result.user) {
          setError(result.error || 'Invalid email or password.');
          return;
        }

        // Step 1 Complete -> Transition to Step 2: Add Username
        setPendingUser(result.user);
        const derivedName = result.user.name && result.user.name !== 'Alex Vance'
          ? result.user.name
          : cleanEmail.split('@')[0];
        setCustomUsername(derivedName);
        setAuthModalMode('username_setup');
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred during login.');
      } finally {
        setLoading(false);
      }
    } else if (authModalMode === 'forgot') {
      if (!cleanEmail || !emailRegex.test(cleanEmail)) {
        setError('Please enter a valid email address.');
        return;
      }

      setLoading(true);
      try {
        const res = await safeApiFetch('/api/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email: cleanEmail }),
        });

        if (!res.success) {
          setError(res.error || 'Failed to send recovery instructions.');
          return;
        }

        setResetSuccess(true);
      } catch (err: any) {
        setError('Unable to send password recovery email right now.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Step 2: Handle Username Submit -> Then Open Dashboard
  const handleUsernameSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUsername = customUsername.trim();
    if (!cleanUsername) {
      setError('Please enter your username / display name.');
      return;
    }

    if (!pendingUser) {
      setError('Session expired. Please log in again.');
      setAuthModalMode('login');
      return;
    }

    setLoading(true);
    try {
      const updatedUser: User = {
        ...pendingUser,
        name: cleanUsername,
        username: cleanUsername,
      };

      // Sync name to server if reachable
      try {
        await safeApiFetch('/api/auth/profile', {
          method: 'PATCH',
          body: JSON.stringify({
            userId: pendingUser.id,
            name: cleanUsername,
          }),
        });
      } catch (e) {
        // Safe fallback in static mode
      }

      // Step 3: Save user and open Dashboard!
      setUser(updatedUser);
      setAuthModalOpen(false);
      setActiveTab('overview');
      showToast(`Welcome, ${cleanUsername}! Dashboard is now open.`);
    } catch (err: any) {
      setError('Failed to save username. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoUser: User = {
      id: `user_${Date.now()}`,
      name: 'Rizwan',
      username: 'Rizwan',
      email: 'user@colorforge.ai',
      avatar: '/src/assets/images/avatar_founder_user_1791282046459.jpg',
      plan: 'pro' as const,
      generationsUsed: 1,
      maxFreeGenerations: 5,
      createdAt: new Date().toISOString(),
    };
    // Proceed to Step 2 so user can customize their username before dashboard
    setPendingUser(demoUser);
    setCustomUsername('Rizwan');
    setAuthModalMode('username_setup');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-2xl">
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* STEP 2: USERNAME SETUP SCREEN */}
        {authModalMode === 'username_setup' ? (
          <div className="space-y-6">
            {/* Step Progress Indicators */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                1. Login Success
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                2. Add Username
              </span>
              <span className="text-slate-500">
                3. Open Dashboard
              </span>
            </div>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
                <UserCheck className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Add Your Username
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Pehle apna username add karein, phir aapka dashboard open hoga.
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}

            {/* Live Username Badge Preview */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {(customUsername || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-bold text-white truncate">
                  {customUsername || 'Your Username'}
                </div>
                <div className="text-[11px] font-mono text-indigo-400 truncate">
                  @{customUsername ? customUsername.toLowerCase().replace(/\s+/g, '') : 'username'}
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                Workspace
              </span>
            </div>

            {/* Username Form */}
            <form onSubmit={handleUsernameSetupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Enter Your Username / Display Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={customUsername}
                    onChange={e => setCustomUsername(e.target.value)}
                    placeholder="e.g. Rizwan, Alex, WebDeveloper..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs font-medium text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
                  />
                </div>
              </div>

              {/* Quick Suggestions Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-slate-500">Suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Rizwan', 'Designer', 'ProductArchitect', 'ra2826572'].map(sug => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setCustomUsername(sug)}
                      className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 hover:border-indigo-500/40 hover:text-white transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA: Then Open Dashboard */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? 'Saving Username...' : 'Save Username & Open Dashboard'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        ) : (
          /* STEP 1: LOGIN / REGISTER / FORGOT PASSWORD */
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold tracking-tight text-white">ColorForge AI</span>
                <span className="text-[10px] font-mono text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                  STUDIO
                </span>
              </div>
              <h2 className="text-lg font-semibold text-slate-100">
                {authModalMode === 'login' && 'Step 1: Sign In to Account'}
                {authModalMode === 'register' && 'Step 1: Create Account'}
                {authModalMode === 'forgot' && 'Reset your password'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {authModalMode === 'login' && 'Pehle login karein, phir apna username add karein.'}
                {authModalMode === 'register' && 'Create your account to unlock your personalized design studio.'}
                {authModalMode === 'forgot' && "Enter your email and we'll send you recovery instructions."}
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}

            {resetSuccess ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-4 text-xs text-emerald-300">
                  Password reset link has been dispatched to <strong className="text-white">{email}</strong>. Please check your inbox.
                </div>
                <button
                  onClick={() => {
                    setResetSuccess(false);
                    setAuthModalMode('login');
                  }}
                  className="w-full rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {authModalMode === 'register' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Rizwan Developer"
                        className="w-full rounded-lg border border-slate-800 bg-slate-950/70 pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ra2826572@gmail.com"
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/70 pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {authModalMode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-slate-300">Password</label>
                      {authModalMode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setAuthModalMode('forgot')}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-slate-800 bg-slate-950/70 pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {authModalMode === 'register' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-slate-800 bg-slate-950/70 pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 shadow-md shadow-indigo-600/20 active:scale-95"
                >
                  {loading ? (
                    'Processing...'
                  ) : authModalMode === 'login' ? (
                    <>Sign In &rarr; Next: Add Username <ArrowRight className="h-3.5 w-3.5" /></>
                  ) : authModalMode === 'register' ? (
                    <>Create Account &rarr; Next: Add Username <Sparkles className="h-3.5 w-3.5" /></>
                  ) : (
                    'Send Recovery Email'
                  )}
                </button>
              </form>
            )}

            <div className="mt-5 pt-5 border-t border-slate-800/80 space-y-3">
              {authModalMode === 'login' ? (
                <>
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-950/20 py-2.5 text-xs font-medium text-indigo-300 hover:bg-indigo-950/40 transition-colors"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Quick Demo Sign In &rarr; Add Username</span>
                  </button>
                  <div className="text-center text-xs text-slate-400">
                    Don't have an account yet?{' '}
                    <button
                      onClick={() => setAuthModalMode('register')}
                      className="font-medium text-indigo-400 hover:text-indigo-300"
                    >
                      Create one now
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-xs text-slate-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthModalMode('login')}
                    className="font-medium text-indigo-400 hover:text-indigo-300"
                  >
                    Sign in here
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
