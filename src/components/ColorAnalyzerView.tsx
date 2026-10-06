import React, { useState } from 'react';
import { ColorAnalysisResult } from '../types/colorforge';
import { useApp } from '../context/AppContext';
import { Sparkles, Search, Copy, Check, ArrowRight, Lightbulb, Compass, ShieldCheck } from 'lucide-react';
import { ColorHarmoniesView } from './ColorHarmoniesView';

export const ColorAnalyzerView: React.FC = () => {
  const { showToast, setActiveSystem, setActiveTab } = useApp();
  const [colorInput, setColorInput] = useState('#6366F1');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ColorAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!colorInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/analyze-color', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colorInput: colorInput.trim() }),
      });
      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();
      setAnalysis(data.analysis);
      showToast(`Analyzed ${data.analysis.hex}`);
    } catch (e) {
      console.error(e);
      showToast('Error analyzing color');
    } finally {
      setLoading(false);
    }
  };

  const presetHues = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Diagnostic Tool</span>
        <h1 className="text-2xl font-bold text-white mt-1">Analyze My Colors</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Enter any HEX, RGB, or HSL value to evaluate cognitive psychology, WCAG compliance rules, best UI placement, and harmonic companion sets.
        </p>
      </div>

      {/* Input Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={colorInput.startsWith('#') && colorInput.length === 7 ? colorInput : '#4F46E5'}
              onChange={e => setColorInput(e.target.value)}
              className="h-11 w-14 rounded-xl border border-slate-700 bg-slate-950 cursor-pointer p-1"
            />
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              value={colorInput}
              onChange={e => setColorInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
              placeholder="Enter HEX (e.g. #4F46E5), RGB rgb(79, 70, 229), or HSL"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 shadow-md shadow-indigo-600/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {loading ? 'Analyzing...' : 'Run Diagnostics'}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto">
          <span className="text-[11px] text-slate-400">Quick Test Samples:</span>
          {presetHues.map(hex => (
            <button
              key={hex}
              onClick={() => {
                setColorInput(hex);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-800 bg-slate-950 text-[11px] font-mono text-slate-300 hover:border-slate-700 transition-colors"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: hex }} />
              {hex}
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Output */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Swatch & Metadata Hero */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
            <div
              className="h-28 w-full p-4 flex items-end justify-between"
              style={{ backgroundColor: analysis.hex }}
            >
              <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded backdrop-blur-md bg-black/50 text-white font-bold">
                {analysis.hex}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded backdrop-blur-md bg-black/40 text-white/90">
                  {analysis.rgb}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded backdrop-blur-md bg-black/40 text-white/90">
                  {analysis.hsl}
                </span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Compass className="h-3.5 w-3.5" />
                  Psychological Profile
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysis.psychology}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Lightbulb className="h-3.5 w-3.5" />
                  Recommended UI Roles
                </h3>
                <ul className="text-xs text-slate-300 space-y-1">
                  {analysis.bestUse.map((u, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Accessibility Guidance
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysis.accessibilityNotes}
                </p>
              </div>
            </div>
          </div>

          {/* Harmonies */}
          {analysis.harmonies && (
            <ColorHarmoniesView harmonies={analysis.harmonies} />
          )}
        </div>
      )}
    </div>
  );
};
