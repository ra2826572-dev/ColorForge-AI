import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  WebsiteLayoutType,
  LayoutColors,
  GeneratedLayoutSystem,
} from '../../types/colorforge';
import {
  computeLayoutDesignSystem,
  CURATED_LAYOUT_PRESETS,
  adjustHexLightness,
  isPerceptuallyDark,
} from '../../utils/layoutEngine';
import { WebsiteLayoutRenderer } from './WebsiteLayoutRenderer';
import { LayoutExportModal } from './LayoutExportModal';
import {
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  Download,
  FolderPlus,
  RefreshCw,
  Layers,
  Wand2,
  Check,
  Sliders,
  Type,
  Maximize2,
  Minimize2,
  Eye,
  Info,
  ShieldCheck,
  CheckCircle2,
  Palette,
  Briefcase,
  Store,
  UtensilsCrossed,
  BookOpen,
  GraduationCap,
  HeartPulse,
  Building,
  Landmark,
  Compass,
  LayoutGrid,
} from 'lucide-react';

export const LayoutGeneratorView: React.FC = () => {
  const { activeSystem, saveCurrentProject, showToast, setActiveTab } = useApp();

  // Step 1: Website Type
  const [selectedType, setSelectedType] = useState<WebsiteLayoutType>('SaaS');

  // Step 2: 6 Base Colors
  const [colors, setColors] = useState<LayoutColors>(() => {
    // If activeSystem exists, initialize from it
    if (activeSystem) {
      const p = activeSystem.activeTheme === 'dark' ? activeSystem.darkPalette : activeSystem.lightPalette;
      return {
        primary: p.primary.hex,
        secondary: p.secondary.hex,
        accent: p.accent.hex,
        background: p.background.hex,
        surface: p.surface.hex,
        text: p.text.hex,
      };
    }
    // Default high-performance modern SaaS
    return {
      primary: '#6366F1',
      secondary: '#4F46E5',
      accent: '#06B6D4',
      background: '#0B0F19',
      surface: '#111827',
      text: '#F8FAFC',
    };
  });

  const [websiteName, setWebsiteName] = useState<string>(
    activeSystem ? activeSystem.websiteName : 'ColorForge AI'
  );

  // Generated System State
  const [generatedLayout, setGeneratedLayout] = useState<GeneratedLayoutSystem>(() =>
    computeLayoutDesignSystem(colors, selectedType, websiteName)
  );

  // Loading animation state for generation
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  // Interactive Preview Controls
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedFont, setSelectedFont] = useState<string>('Inter, sans-serif');
  const [selectedRadius, setSelectedRadius] = useState<string>('12px');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [showAnalysisCard, setShowAnalysisCard] = useState<boolean>(true);

  // Website Type Definitions with icons and descriptions
  const websiteTypes: {
    type: WebsiteLayoutType;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    description: string;
  }[] = [
    { type: 'SaaS', icon: Layers, description: 'High-conversion software platforms' },
    { type: 'Portfolio', icon: Briefcase, description: 'Creative personal work showcases' },
    { type: 'Agency', icon: Compass, description: 'Avant-garde creative consultancies' },
    { type: 'E-commerce', icon: Store, description: 'Product catalogs & checkout funnels' },
    { type: 'Restaurant', icon: UtensilsCrossed, description: 'Artisanal dining & reservation menus' },
    { type: 'Blog', icon: BookOpen, description: 'Longform journalism & publications' },
    { type: 'Education', icon: GraduationCap, description: 'Online academies & cohort courses' },
    { type: 'Healthcare', icon: HeartPulse, description: 'Clinical trusts & patient portals' },
    { type: 'Real Estate', icon: Building, description: 'Luxury estates & property listings' },
    { type: 'Finance', icon: Landmark, description: 'Institutional fintech & treasury banking' },
    { type: 'Landing Page', icon: Wand2, description: 'Focused marketing launch funnels' },
    { type: 'Dashboard', icon: LayoutGrid, description: 'Analytical SaaS console applications' },
  ];

  // Fonts available
  const fontOptions = [
    { name: 'Inter', value: 'Inter, system-ui, sans-serif' },
    { name: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif' },
    { name: 'Playfair Display (Serif)', value: '"Playfair Display", Georgia, serif' },
    { name: 'Space Grotesk (Tech)', value: '"Space Grotesk", sans-serif' },
    { name: 'Manrope (Modern)', value: 'Manrope, sans-serif' },
  ];

  const radiusOptions = [
    { name: 'Sharp (0px)', value: '0px' },
    { name: 'Subtle (6px)', value: '6px' },
    { name: 'Modern (12px)', value: '12px' },
    { name: 'Pill (20px)', value: '20px' },
  ];

  // Handle color change
  const handleColorChange = (key: keyof LayoutColors, value: string) => {
    let formatted = value.startsWith('#') ? value : `#${value}`;
    if (formatted.length > 7) formatted = formatted.slice(0, 7);
    const updated = { ...colors, [key]: formatted };
    setColors(updated);

    // Auto-update generated layout in real time for immediate feedback
    const newSystem = computeLayoutDesignSystem(updated, selectedType, websiteName);
    newSystem.borderRadius = selectedRadius;
    setGeneratedLayout(newSystem);
  };

  // Step 3: Trigger ✨ Generate Website Layout
  const handleGenerateLayout = () => {
    setIsGenerating(true);
    setGenerationStep('Analyzing color hierarchy & contrast ratios...');

    setTimeout(() => {
      setGenerationStep('Deriving mathematical hover, border & shadow tokens...');
    }, 400);

    setTimeout(() => {
      setGenerationStep('Assembling production layout structure...');
    }, 800);

    setTimeout(() => {
      const newSystem = computeLayoutDesignSystem(colors, selectedType, websiteName);
      newSystem.borderRadius = selectedRadius;
      setGeneratedLayout(newSystem);
      setIsGenerating(false);
      setGenerationStep('');
      showToast(`Website Layout generated for ${selectedType} with ${newSystem.analysis.colorHarmonyScore}% harmony!`);
    }, 1100);
  };

  // Invert Dark/Light Canvas mathematically
  const handleInvertCanvas = () => {
    const isDark = isPerceptuallyDark(colors.background);
    const newBg = isDark ? '#FFFFFF' : '#0B0F19';
    const newSurface = isDark ? '#F8FAFC' : '#111827';
    const newText = isDark ? '#0F172A' : '#F8FAFC';

    const updated = {
      ...colors,
      background: newBg,
      surface: newSurface,
      text: newText,
    };
    setColors(updated);
    const newSystem = computeLayoutDesignSystem(updated, selectedType, websiteName);
    newSystem.borderRadius = selectedRadius;
    setGeneratedLayout(newSystem);
    showToast(`Switched canvas to ${isDark ? 'Light Mode' : 'Dark Mode'}`);
  };

  // Load from active palette in ColorForge
  const handleLoadFromActivePalette = () => {
    if (!activeSystem) {
      showToast('No active palette loaded in ColorForge yet. Generate a palette first or pick a preset below!');
      return;
    }
    const p = activeSystem.activeTheme === 'dark' ? activeSystem.darkPalette : activeSystem.lightPalette;
    const imported: LayoutColors = {
      primary: p.primary.hex,
      secondary: p.secondary.hex,
      accent: p.accent.hex,
      background: p.background.hex,
      surface: p.surface.hex,
      text: p.text.hex,
    };
    setColors(imported);
    setWebsiteName(activeSystem.websiteName);
    const newSystem = computeLayoutDesignSystem(imported, selectedType, activeSystem.websiteName);
    setGeneratedLayout(newSystem);
    showToast(`Loaded colors from active palette: "${activeSystem.websiteName}"`);
  };

  // Load Curated Preset
  const handleLoadPreset = (preset: (typeof CURATED_LAYOUT_PRESETS)[0]) => {
    setColors(preset.colors);
    setSelectedType(preset.type);
    setWebsiteName(preset.name);
    const newSystem = computeLayoutDesignSystem(preset.colors, preset.type, preset.name);
    setGeneratedLayout(newSystem);
    showToast(`Loaded preset: ${preset.name}`);
  };

  const getContainerWidth = () => {
    if (isFullscreen) return 'w-full';
    switch (device) {
      case 'mobile':
        return 'max-w-[400px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'w-full';
    }
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Website Layout Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Generate Realistic Website Layouts From Your Colors
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
            Transform any color palette into a full production website layout preview. Powered strictly by your selected colors with mathematical harmony and zero invented noise.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSystem && (
            <button
              onClick={handleLoadFromActivePalette}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-indigo-500/50 hover:text-white transition-all shadow-sm"
            >
              <Palette className="h-3.5 w-3.5 text-indigo-400" />
              <span>Import Active Palette</span>
            </button>
          )}

          <button
            onClick={() => setExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Code</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Loader Strip */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span>Curated Color & Layout Presets</span>
          <span>Click any preset to preview instantly</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CURATED_LAYOUT_PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => handleLoadPreset(preset)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-800 hover:border-indigo-500/40 transition-all text-left shrink-0 group"
            >
              <div className="flex -space-x-1">
                <span className="w-3.5 h-3.5 rounded-full border border-slate-900" style={{ backgroundColor: preset.colors.primary }} />
                <span className="w-3.5 h-3.5 rounded-full border border-slate-900" style={{ backgroundColor: preset.colors.secondary }} />
                <span className="w-3.5 h-3.5 rounded-full border border-slate-900" style={{ backgroundColor: preset.colors.accent }} />
                <span className="w-3.5 h-3.5 rounded-full border border-slate-900" style={{ backgroundColor: preset.colors.background }} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{preset.name}</div>
                <div className="text-[10px] text-slate-400">{preset.type}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1 & STEP 2 Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step 1: Choose Website Type (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h2 className="text-sm font-bold text-white">Choose Website Type</h2>
            </div>
            <span className="text-[11px] text-slate-400">12 Specialized Layouts</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {websiteTypes.map(item => {
              const Icon = item.icon;
              const isSelected = selectedType === item.type;
              return (
                <button
                  key={item.type}
                  onClick={() => {
                    setSelectedType(item.type);
                    const newSystem = computeLayoutDesignSystem(colors, item.type, websiteName);
                    newSystem.borderRadius = selectedRadius;
                    setGeneratedLayout(newSystem);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-600/15 text-white shadow-md ring-1 ring-indigo-500/30'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                    {isSelected && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">{item.type}</div>
                    <div className="text-[9px] text-slate-400 truncate">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Website Name / Brand Title
            </label>
            <input
              type="text"
              value={websiteName}
              onChange={e => {
                setWebsiteName(e.target.value);
                setGeneratedLayout(prev => ({ ...prev, websiteName: e.target.value }));
              }}
              placeholder="e.g. Acme Cloud Platform"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Step 2: Select Colors (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h2 className="text-sm font-bold text-white">Select Palette Colors</h2>
              </div>

              <button
                onClick={handleInvertCanvas}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Invert Canvas</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'primary', label: 'Primary Color' },
                { key: 'secondary', label: 'Secondary Color' },
                { key: 'accent', label: 'Accent Color' },
                { key: 'background', label: 'Background Color' },
                { key: 'surface', label: 'Surface/Card Color' },
                { key: 'text', label: 'Text Color' },
              ].map(item => {
                const colorKey = item.key as keyof LayoutColors;
                const hexValue = colors[colorKey];

                return (
                  <div
                    key={item.key}
                    className="p-2.5 rounded-xl border border-slate-800/80 bg-slate-950/70 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-300">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Color Picker Swatch */}
                      <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-slate-700/80 shadow-xs">
                        <input
                          type="color"
                          value={hexValue.length === 7 ? hexValue : '#000000'}
                          onChange={e => handleColorChange(colorKey, e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: hexValue }}
                        />
                      </div>

                      <input
                        type="text"
                        value={hexValue}
                        onChange={e => handleColorChange(colorKey, e.target.value)}
                        className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-[11px] font-mono text-slate-200 focus:outline-none focus:border-indigo-500 uppercase"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3 Prominent Button */}
          <div className="pt-2">
            <button
              onClick={handleGenerateLayout}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? generationStep || 'Analyzing & Generating...' : '✨ Generate Website Layout'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI DESIGN ANALYSIS CARD */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">AI Design Analysis</h2>
              <p className="text-[11px] text-slate-400">
                Mathematical evaluation and role hierarchy derived strictly from your 6 colors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              WCAG {generatedLayout.analysis.accessibilityRating} Compliant
            </span>
            <button
              onClick={() => setShowAnalysisCard(!showAnalysisCard)}
              className="px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-400 hover:text-white"
            >
              {showAnalysisCard ? 'Collapse Details' : 'Expand Details'}
            </button>
          </div>
        </div>

        {showAnalysisCard && (
          <div className="space-y-4">
            {/* Metric Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Color Harmony</span>
                <div className="text-xl font-black text-indigo-400 flex items-baseline gap-1">
                  <span>{generatedLayout.analysis.colorHarmonyScore}%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Contrast</span>
                <div className="text-base font-bold text-emerald-400">
                  {generatedLayout.analysis.contrastRating}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Accessibility</span>
                <div className="text-base font-bold text-white">
                  {generatedLayout.analysis.accessibilityRating}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Style</span>
                <div className="text-xs font-bold text-slate-200 truncate">
                  {generatedLayout.analysis.style}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Recommended Radius</span>
                <div className="text-base font-bold text-slate-200">
                  {generatedLayout.analysis.recommendedRadius}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 lg:col-span-2">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Recommended Typography</span>
                <div className="text-xs font-bold text-indigo-300 truncate">
                  {generatedLayout.analysis.recommendedTypography}
                </div>
              </div>
            </div>

            {/* Role Usage Explanations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.primary }} />
                  <span className="font-bold text-white">Primary Usage:</span>
                </div>
                <p className="text-slate-400 text-[11px]">{generatedLayout.analysis.primaryUsage}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
                  <span className="font-bold text-white">Secondary Usage:</span>
                </div>
                <p className="text-slate-400 text-[11px]">{generatedLayout.analysis.secondaryUsage}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.accent }} />
                  <span className="font-bold text-white">Accent Usage:</span>
                </div>
                <p className="text-slate-400 text-[11px]">{generatedLayout.analysis.accentUsage}</p>
              </div>
            </div>

            {/* Why Colors Work Together */}
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 text-xs">
              <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1">
                <Info className="h-4 w-4" />
                <span>Why These Colors Work Together</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {generatedLayout.analysis.whyColorsWork}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* LARGE INTERACTIVE WEBSITE PREVIEW AREA */}
      <div className="space-y-4">
        {/* Preview Control Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-slate-800 bg-slate-900 shadow-md">
          {/* Device Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                device === 'desktop' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                device === 'tablet' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tablet className="h-3.5 w-3.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                device === 'mobile' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          {/* Quick Customization Controls */}
          <div className="flex items-center gap-3">
            {/* Font Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Type className="h-3.5 w-3.5" />
              <select
                value={selectedFont}
                onChange={e => setSelectedFont(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
              >
                {fontOptions.map(f => (
                  <option key={f.name} value={f.value}>{f.name}</option>
                ))}
              </select>
            </div>

            {/* Radius Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Sliders className="h-3.5 w-3.5" />
              <select
                value={selectedRadius}
                onChange={e => {
                  setSelectedRadius(e.target.value);
                  setGeneratedLayout(prev => ({
                    ...prev,
                    borderRadius: e.target.value,
                  }));
                }}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
              >
                {radiusOptions.map(r => (
                  <option key={r.name} value={r.value}>{r.name}</option>
                ))}
              </select>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* The Frame / Container */}
        <div
          className={`flex justify-center rounded-2xl border border-slate-800 bg-slate-950/80 p-2 sm:p-6 shadow-inner transition-all ${
            isFullscreen ? 'fixed inset-0 z-50 p-0 sm:p-0 rounded-none bg-slate-950 overflow-y-auto' : ''
          }`}
        >
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="fixed top-4 right-4 z-50 p-2 rounded-full bg-slate-900 border border-slate-700 text-white shadow-xl hover:scale-105"
            >
              <Minimize2 className="h-5 w-5" />
            </button>
          )}

          <div
            className={`${getContainerWidth()} rounded-2xl overflow-hidden shadow-2xl border border-slate-800 transition-all duration-300 flex flex-col`}
          >
            {/* Mock Browser Header Bar */}
            <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 max-w-sm truncate">
                <span className="text-emerald-400 font-bold">https://</span>
                <span>{websiteName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</span>
              </div>

              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                {selectedType}
              </div>
            </div>

            {/* Render Selected Website Layout */}
            <div className="w-full flex-1 overflow-x-hidden">
              <WebsiteLayoutRenderer
                system={generatedLayout}
                fontFamily={selectedFont}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Layout Export Modal */}
      <LayoutExportModal
        system={generatedLayout}
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
};
