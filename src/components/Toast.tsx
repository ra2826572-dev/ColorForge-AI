import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-lg bg-slate-900 border border-slate-800 px-4 py-3 text-sm font-medium text-slate-100 shadow-xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
      <span>{toastMessage}</span>
    </div>
  );
};
