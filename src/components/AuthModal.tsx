import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, authModalMode, setAuthModalMode, setUser, showToast, setActiveTab } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authModalMode === 'register') {
        if (!name.trim()) throw new Error('Please provide your full name.');
        if (!email.trim() || !email.includes('@')) throw new Error('Please provide a valid email address.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        if (password !== confirmPassword) throw new Error('Passwords do not match.');

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');

        setUser(data.user);
        setAuthModalOpen(false);
        setActiveTab('overview');
        showToast(`Welcome to ColorForge AI, ${data.user.name}!`);
      } else if (authModalMode === 'login') {
        if (!email.trim() || !password) throw new Error('Please enter both email and password.');

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Invalid credentials');

        setUser(data.user);
        setAuthModalOpen(false);
        setActiveTab('overview');
        showToast(`Welcome back, ${data.user.name}`);
      } else if (authModalMode === 'forgot') {
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email address.');
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to send reset email');
        setResetSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoUser = {
      id: 'user_demo_1',
      name: 'Alex Vance',
      email: 'alex.vance@studio.design',
      avatar: '/src/assets/images/avatar_designer_user_1791282031801.jpg',
      plan: 'pro' as const,
      generationsUsed: 3,
      maxFreeGenerations: 5,
      createdAt: new Date().toISOString(),
    };
    setUser(demoUser);
    setAuthModalOpen(false);
    setActiveTab('overview');
    showToast('Signed in with Alex Vance (Pro Demo Workspace)');
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

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-bold tracking-tight text-white">ColorForge AI</span>
            <span className="text-[10px] font-mono text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded">STUDIO</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-100">
            {authModalMode === 'login' && 'Sign in to your account'}
            {authModalMode === 'register' && 'Create your ColorForge account'}
            {authModalMode === 'forgot' && 'Reset your password'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {authModalMode === 'login' && 'Access your color systems, brand projects, and AI generator.'}
            {authModalMode === 'register' && 'Start generating production-grade color palettes in seconds.'}
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
                    placeholder="e.g. Elena Rostova"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/70 pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
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
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 shadow-md shadow-indigo-600/20"
            >
              {loading ? (
                'Processing...'
              ) : authModalMode === 'login' ? (
                <>Sign In <ArrowRight className="h-3.5 w-3.5" /></>
              ) : authModalMode === 'register' ? (
                <>Create Account <Sparkles className="h-3.5 w-3.5" /></>
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
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-950/20 py-2 text-xs font-medium text-indigo-300 hover:bg-indigo-950/40 transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                1-Click Demo Login (Instant Access)
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
      </div>
    </div>
  );
};
