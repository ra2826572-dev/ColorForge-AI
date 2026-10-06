import React, { useState } from 'react';
import { ColorSystem } from '../types/colorforge';
import { useApp } from '../context/AppContext';
import { ColorRolesGrid } from './ColorRolesGrid';
import { ColorScalesView } from './ColorScalesView';
import { AccessibilityTable } from './AccessibilityTable';
import { ColorHarmoniesView } from './ColorHarmoniesView';
import { LiveWebsitePreview } from './LiveWebsitePreview';
import {
  Sun,
  Moon,
  Bookmark,
  Download,
  Sparkles,
  Send,
  HelpCircle,
  AlertOctagon,
  CheckCircle,
  Compass,
  Layers,
} from 'lucide-react';

interface PaletteDetailViewProps {
  system: ColorSystem;
}

export const PaletteDetailView: React.FC<PaletteDetailViewProps> = ({ system }) => {
  const { setActiveSystem, saveCurrentProject, setExportModalOpen, showToast, setActiveTab } = useApp();
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'roles' | 'preview' | 'scales' | 'accessibility' | 'harmonies'>('roles');

  const currentThemeMode = system.activeTheme;
  const activePalette = currentThemeMode === 'dark' ? system.darkPalette : system.lightPalette;

  const toggleTheme = () => {
    const nextTheme = currentThemeMode === 'dark' ? 'light' : 'dark';
    setActiveSystem({
      ...system,
      activeTheme: nextTheme,
    });
    showToast(`Switched to ${nextTheme.toUpperCase()} theme view`);
  };

  const handleRefine = async (customPrompt?: string) => {
    const promptToSend = customPrompt || refinePrompt.trim();
    if (!promptToSend) return;

    setIsRefining(true);
    try {
      const res = await fetch('/api/refine-palette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSystem: system,
          prompt: promptToSend,
        }),
      });

      if (!res.ok) throw new Error('Refinement failed');
      const data = await res.json();
      setActiveSystem(data.colorSystem);
      setRefinePrompt('');
      showToast('Palette successfully refined with AI');
    } catch (err) {
      console.error(err);
      showToast('Error refining palette');
    } finally {
      setIsRefining(false);
    }
  };

  const promptSuggestions = [
    'Make it more luxurious',
    'Make it suitable for a restaurant',
    'Use more blue',
    'Make it look like a premium SaaS',
    'Make it more professional',
    'Make the colors softer',
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {system.websiteName}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-300">
              {system.category}
            </span>
            <span className="text-xs text-slate-400">· {system.style}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {system.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Generate Website Layout Button */}
          <button
            onClick={() => setActiveTab('layout-generator')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white hover:opacity-95 transition-all shadow-md shadow-indigo-600/30 active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            <span>✨ Generate Website Layout</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-200 hover:border-slate-700 hover:bg-slate-800 transition-colors"
          >
            {currentThemeMode === 'dark' ? (
              <>
                <Moon className="h-4 w-4 text-indigo-400" />
                <span>Dark Theme</span>
              </>
            ) : (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                <span>Light Theme</span>
              </>
            )}
          </button>

          {/* Save Project Button */}
          <button
            onClick={() => saveCurrentProject()}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-200 hover:border-slate-700 hover:bg-slate-800 transition-colors"
          >
            <Bookmark className="h-4 w-4 text-slate-400" />
            <span>Save to Projects</span>
          </button>

          {/* Export Button */}
          <button
            onClick={() => setExportModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Export Tokens</span>
          </button>
        </div>
      </div>

      {/* 2. Natural Language AI Refinement Bar */}
      <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Natural-Language AI Refinement
          </h3>
          <span className="text-[11px] text-slate-400">
            (Evolves current palette coherently without resetting)
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={refinePrompt}
            onChange={e => setRefinePrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRefine()}
            placeholder="Tell AI how you want to change your palette... (e.g. 'Make it more luxurious', 'Increase warmth for buttons')"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          <button
            disabled={isRefining || !refinePrompt.trim()}
            onClick={() => handleRefine()}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            {isRefining ? 'Refining...' : (
              <>
                <span>Refine</span>
                <Send className="h-3 w-3" />
              </>
            )}
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-500 mr-1">Suggestions:</span>
          {promptSuggestions.map((s, idx) => (
            <button
              key={idx}
              disabled={isRefining}
              onClick={() => handleRefine(s)}
              className="rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-[11px] text-slate-300 hover:border-indigo-500/50 hover:text-white transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 3. AI Brand Explanation Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Compass className="h-4 w-4 text-indigo-400" />
            AI Brand Intelligence & Psychological Rationale
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            Engineered for {system.targetAudience}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div>
            <h4 className="font-semibold text-slate-200 mb-1">Brand Personality</h4>
            <p className="text-slate-400 leading-relaxed">
              {system.brandExplanation.brandPersonality}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 mb-1">Color Psychology</h4>
            <p className="text-slate-400 leading-relaxed">
              {system.brandExplanation.colorPsychology}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 mb-1">Why These Colors Work</h4>
            <p className="text-slate-400 leading-relaxed">
              {system.brandExplanation.whyTheseColorsWork}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800/80 text-xs">
          <div className="space-y-2">
            <h4 className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5" />
              Recommended Usage
            </h4>
            <ul className="space-y-1 text-slate-400">
              {system.brandExplanation.recommendedUsage.map((u, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">·</span>
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-rose-400 flex items-center gap-1.5">
              <AlertOctagon className="h-3.5 w-3.5" />
              Things to Avoid
            </h4>
            <ul className="space-y-1 text-slate-400">
              {system.brandExplanation.thingsToAvoid.map((a, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">·</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('roles')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors ${
            activeSubTab === 'roles'
              ? 'border-b-2 border-indigo-500 text-white bg-slate-900/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Color Roles & Swatches
        </button>
        <button
          onClick={() => setActiveSubTab('preview')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors ${
            activeSubTab === 'preview'
              ? 'border-b-2 border-indigo-500 text-white bg-slate-900/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Live Website Preview
        </button>
        <button
          onClick={() => setActiveSubTab('scales')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors ${
            activeSubTab === 'scales'
              ? 'border-b-2 border-indigo-500 text-white bg-slate-900/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Tonal Scales (50-950)
        </button>
        <button
          onClick={() => setActiveSubTab('accessibility')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors ${
            activeSubTab === 'accessibility'
              ? 'border-b-2 border-indigo-500 text-white bg-slate-900/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          WCAG Accessibility
        </button>
        <button
          onClick={() => setActiveSubTab('harmonies')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors ${
            activeSubTab === 'harmonies'
              ? 'border-b-2 border-indigo-500 text-white bg-slate-900/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Harmonies & Wheels
        </button>
      </div>

      {/* 5. Sub-Tab View Rendering */}
      <div>
        {activeSubTab === 'roles' && (
          <ColorRolesGrid palette={activePalette} themeMode={currentThemeMode} />
        )}

        {activeSubTab === 'preview' && (
          <LiveWebsitePreview
            system={system}
            onQuickRefine={handleRefine}
            isRefining={isRefining}
          />
        )}

        {activeSubTab === 'scales' && (
          <ColorScalesView scales={system.colorScales} />
        )}

        {activeSubTab === 'accessibility' && (
          <AccessibilityTable checks={system.accessibility} />
        )}

        {activeSubTab === 'harmonies' && (
          <ColorHarmoniesView harmonies={system.harmonies} />
        )}
      </div>
    </div>
  );
};
