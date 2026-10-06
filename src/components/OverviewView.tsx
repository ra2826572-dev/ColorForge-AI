import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Palette,
  FolderKanban,
  LayoutTemplate,
  ArrowRight,
  Star,
  Clock,
  Plus,
  Zap,
  Crown,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    projects,
    history,
    setActiveTab,
    setActiveSystem,
    toggleFavoriteProject,
    dataLoading,
    dataError,
    refreshData,
    upgradePlan,
  } = useApp();

  const validProjects = Array.isArray(projects) ? projects : [];
  const validHistory = Array.isArray(history) ? history : [];

  const totalProjects = validProjects.length;
  const favoriteProjects = validProjects.filter(p => p && p.isFavorite).length;

  const aiGenerationsUsed = user?.aiGenerationsUsed ?? user?.generationsUsed ?? 0;
  const maxAiGenerations = user?.maxAiGenerations ?? 10;
  const palettesUsed = user?.palettesUsed ?? totalProjects;
  const maxPalettes = user?.maxPalettes ?? 20;

  const recentProjects = validProjects.slice(0, 4);

  // Error State
  if (dataError && !dataLoading && validProjects.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-8 text-center space-y-4 max-w-lg mx-auto">
          <AlertTriangle className="h-10 w-10 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Something went wrong while loading your workspace.</h2>
          <p className="text-xs text-rose-300/80">{typeof dataError === 'string' ? dataError : JSON.stringify(dataError)}</p>
          <button
            onClick={() => refreshData()}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-colors shadow-md"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // Skeleton Loader State
  if (dataLoading && validProjects.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
        <div className="h-32 rounded-2xl bg-slate-900 border border-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800" />
          <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800" />
          <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-28 rounded-xl bg-slate-900 border border-slate-800" />
          <div className="h-28 rounded-xl bg-slate-900 border border-slate-800" />
          <div className="h-28 rounded-xl bg-slate-900 border border-slate-800" />
          <div className="h-28 rounded-xl bg-slate-900 border border-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 sm:p-8 shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3 py-0.5 text-[11px] font-mono font-medium text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Workspace Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.username || user?.name || 'Designer'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            Create professional website designs from your colors with AI.
          </p>
        </div>

        {/* Free Plan Usage Metrics Card */}
        <div className="shrink-0 rounded-xl border border-slate-800 bg-slate-950/80 p-4 min-w-[260px] space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-white uppercase tracking-wider font-mono">
              Plan: {user?.plan?.toUpperCase() || 'FREE'}
            </span>
            {user?.plan === 'free' && (
              <button
                onClick={() => upgradePlan('pro')}
                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <Crown className="h-3 w-3" />
                Upgrade
              </button>
            )}
          </div>

          <div className="space-y-2 text-xs">
            {/* AI Generations Meter */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>AI Generations</span>
                <span className="font-mono text-white font-medium">
                  {aiGenerationsUsed} / {user?.plan === 'pro' ? '∞' : maxAiGenerations}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{
                    width: user?.plan === 'pro' ? '100%' : `${Math.min(100, (aiGenerationsUsed / maxAiGenerations) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Color Palettes Meter */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Color Palettes</span>
                <span className="font-mono text-white font-medium">
                  {palettesUsed} / {user?.plan === 'pro' ? '∞' : maxPalettes}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{
                    width: user?.plan === 'pro' ? '100%' : `${Math.min(100, (palettesUsed / maxPalettes) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Feature Card 1: AI Website Layout */}
        <div className="group rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 via-slate-900 to-slate-900 p-6 flex flex-col justify-between hover:border-indigo-500/60 transition-all shadow-lg hover:shadow-indigo-950/40">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <LayoutTemplate className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              AI Website Layout
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Turn your selected colors into a complete website design.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                setActiveTab('layout-generator');
                navigate('/studio');
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate Layout</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Feature Card 2: Color Generator */}
        <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Palette className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Color Generator
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create and refine professional color palettes.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                setActiveTab('generator');
                navigate('/generator');
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-3 text-xs font-bold text-slate-100 hover:bg-slate-700 hover:text-white transition-colors active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Create Palette</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Feature Card 3: My Projects */}
        <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <FolderKanban className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              My Projects
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              View your saved designs and palettes.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                setActiveTab('projects');
                navigate('/projects');
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-3 text-xs font-bold text-slate-100 hover:bg-slate-700 hover:text-white transition-colors active:scale-95"
            >
              <FolderKanban className="h-4 w-4" />
              <span>View Projects</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Recent Activity Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-400" />
            Recent Activity
          </h2>
          {validProjects.length > 0 && (
            <button
              onClick={() => {
                setActiveTab('projects');
                navigate('/projects');
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>View all ({totalProjects})</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>

        {recentProjects.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-500">
              <FolderKanban className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-sm font-bold text-slate-200">No projects yet</h3>
              <p className="text-xs text-slate-400">
                Create your first AI website layout or color system to see it here.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveTab('layout-generator');
                  navigate('/studio');
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
              >
                <Sparkles className="h-4 w-4" />
                <span>Create Your First Design</span>
              </button>
            </div>
          </div>
        ) : (
          /* Recent Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProjects.map(proj => {
              if (!proj) return null;
              const cs = proj.colorSystem;
              const pal = cs?.lightPalette || cs?.darkPalette;

              const pPri = pal?.primary?.hex || '#6366F1';
              const pSec = pal?.secondary?.hex || '#4F46E5';
              const pAcc = pal?.accent?.hex || '#06B6D4';
              const pSurf = pal?.surface?.hex || '#111827';
              const pBg = pal?.background?.hex || '#0B0F19';

              return (
                <div
                  key={proj.id}
                  className="group rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3 hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Color Swatches Bar */}
                    <div className="flex h-10 rounded-lg overflow-hidden border border-slate-800 mb-3 shadow-inner">
                      <div className="flex-1" style={{ backgroundColor: pPri }} />
                      <div className="flex-1" style={{ backgroundColor: pSec }} />
                      <div className="flex-1" style={{ backgroundColor: pAcc }} />
                      <div className="flex-1" style={{ backgroundColor: pSurf }} />
                      <div className="flex-1" style={{ backgroundColor: pBg }} />
                    </div>

                    <div className="flex items-start justify-between gap-1">
                      <div className="overflow-hidden">
                        <h3 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                          {proj.projectName || proj.websiteName || 'Untitled System'}
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

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {proj.updatedAt ? new Date(proj.updatedAt).toLocaleDateString() : 'Recent'}
                    </span>
                    <button
                      onClick={() => {
                        if (proj.colorSystem) {
                          setActiveSystem(proj.colorSystem);
                          setActiveTab('layout-generator');
                          navigate('/studio');
                        }
                      }}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>Preview Layout</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
