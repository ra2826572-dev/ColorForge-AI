import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { History as HistoryIcon, Trash2, ExternalLink, Filter } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { history, deleteHistoryItem, setActiveSystem, setActiveTab } = useApp();
  const [filter, setFilter] = useState<'all' | 'recent' | 'light' | 'dark'>('all');

  const validHistory = Array.isArray(history) ? history : [];

  const filteredHistory = validHistory.filter(item => {
    if (!item) return false;
    if (filter === 'light') return item.colorSystem?.activeTheme === 'light';
    if (filter === 'dark') return item.colorSystem?.activeTheme === 'dark';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Activity Log</span>
          <h1 className="text-2xl font-bold text-white mt-1">Generation History</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse through previous generation runs, inspect color scales, and restore any previous state.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['all', 'recent', 'light', 'dark'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                filter === f ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center space-y-3">
          <HistoryIcon className="mx-auto h-8 w-8 text-slate-600" />
          <p className="text-sm font-semibold text-slate-300">No generation history yet</p>
          <p className="text-xs text-slate-500">
            Every color palette you generate with ColorForge AI will automatically log here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map(item => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 hover:border-slate-700 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-4">
                {/* 4 Swatch Micro Preview */}
                <div className="flex h-10 w-24 rounded-lg overflow-hidden border border-slate-800 shrink-0">
                  <div className="flex-1" style={{ backgroundColor: item.primaryHex }} />
                  <div className="flex-1" style={{ backgroundColor: item.secondaryHex }} />
                  <div className="flex-1" style={{ backgroundColor: item.backgroundHex }} />
                  <div className="flex-1" style={{ backgroundColor: item.textHex }} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white">{item.websiteName}</h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-slate-800 bg-slate-950 text-slate-400">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {item.style}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {item.promptSummary}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-500">
                  {new Date(item.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveSystem(item.colorSystem);
                      setActiveTab('palette');
                    }}
                    className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
