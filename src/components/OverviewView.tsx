import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Folder, Palette, ArrowRight, Star, Clock, Plus, Zap, Check } from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { user, projects, history, setActiveTab, setActiveSystem, toggleFavoriteProject } = useApp();

  const totalProjects = projects.length;
  const favoriteProjects = projects.filter(p => p.isFavorite).length;
  const totalColorsGenerated = history.length * 18 + 36; // 18 semantic roles per generation

  const recentProjects = projects.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner with Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 shadow-xl">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Workspace Dashboard</span>
          <h1 className="text-2xl font-bold text-white mt-1">
            Welcome back, {user?.username || user?.name || 'Designer'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-lg">
            Manage your brand systems, generate accessible website palettes, and export design tokens in one unified hub.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('layout-generator')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 px-5 py-3 text-xs font-bold text-white hover:opacity-95 transition-all shadow-lg shadow-indigo-600/30"
          >
            <Sparkles className="h-4 w-4" />
            AI Layout Generator
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all shadow-md"
          >
            <Plus className="h-4 w-4" />
            New Color System
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Projects</span>
            <Folder className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">{totalProjects}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Active brand systems</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Saved Palettes</span>
            <Palette className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">{totalProjects}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">{favoriteProjects} marked favorite</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Generated Colors</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">{totalColorsGenerated}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Across light & dark themes</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Plan Quota</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {user?.generationsUsed || 0} / {user?.plan === 'pro' ? '∞' : user?.maxFreeGenerations || 5}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {user?.plan === 'pro' ? 'Pro plan unlimited' : 'Free monthly allowance'}
          </span>
        </div>
      </div>

      {/* Recent Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-400" />
            Recent Projects
          </h2>
          <button
            onClick={() => setActiveTab('projects')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            View all projects &rarr;
          </button>
        </div>

        {recentProjects.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-12 text-center space-y-3">
            <Palette className="mx-auto h-8 w-8 text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-300">No color systems created yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start by creating your first AI-engineered website color system.
            </p>
            <button
              onClick={() => setActiveTab('generator')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              New System
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProjects.map(proj => {
              const pal = proj.colorSystem.activeTheme === 'dark' ? proj.colorSystem.darkPalette : proj.colorSystem.lightPalette;
              return (
                <div
                  key={proj.id}
                  className="group rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3 hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    {/* Color Preview Swatches */}
                    <div className="flex h-12 rounded-lg overflow-hidden border border-slate-800 mb-3">
                      <div className="flex-1" style={{ backgroundColor: pal.primary.hex }} />
                      <div className="flex-1" style={{ backgroundColor: pal.secondary.hex }} />
                      <div className="flex-1" style={{ backgroundColor: pal.accent.hex }} />
                      <div className="flex-1" style={{ backgroundColor: pal.surface.hex }} />
                      <div className="flex-1" style={{ backgroundColor: pal.background.hex }} />
                    </div>

                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h3 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors truncate max-w-[170px]">
                          {proj.projectName}
                        </h3>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {proj.websiteName} · {proj.category}
                        </p>
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleFavoriteProject(proj.id);
                        }}
                        className="text-slate-500 hover:text-amber-400 transition-colors p-1"
                      >
                        <Star className={`h-3.5 w-3.5 ${proj.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(proj.updatedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => {
                        setActiveSystem(proj.colorSystem);
                        setActiveTab('palette');
                      }}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      Open &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Recommendations Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Pro Feature Spot</span>
          <h3 className="text-sm font-bold text-white mt-0.5">
            Looking to verify an existing brand hex code?
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Use the Color Analyzer to dissect psychological impact, WCAG contrast thresholds, and derived harmonic palettes.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('analyzer')}
          className="whitespace-nowrap rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
        >
          Open Color Analyzer
        </button>
      </div>
    </div>
  );
};
