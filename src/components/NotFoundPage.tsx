import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft, LayoutTemplate } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
          <span className="text-2xl font-black font-mono">404</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white">Page Not Found</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The page you are looking for does not exist or may have moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <button
            onClick={() => navigate(user ? '/dashboard' : '/')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Home className="h-4 w-4" />
            <span>{user ? 'Return to Dashboard' : 'Go to Home'}</span>
          </button>

          {user && (
            <button
              onClick={() => navigate('/studio')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <LayoutTemplate className="h-4 w-4 text-indigo-400" />
              <span>AI Website Layout Generator</span>
            </button>
          )}

          <button
            onClick={() => navigate(-1)}
            className="w-full py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
