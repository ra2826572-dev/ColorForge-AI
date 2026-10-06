import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, ArrowLeft, Check, Wand2, ShieldAlert, Layers } from 'lucide-react';

const CATEGORIES = [
  'Portfolio',
  'SaaS',
  'E-commerce',
  'Restaurant',
  'Agency',
  'Blog',
  'News',
  'Education',
  'Healthcare',
  'Finance',
  'Real Estate',
  'Technology',
  'Beauty',
  'Fashion',
  'Personal Brand',
  'Gaming',
  'Other',
];

const AUDIENCES = [
  'General',
  'Students',
  'Professionals',
  'Businesses',
  'Developers',
  'Creators',
  'Luxury Customers',
  'Young Audience',
  'Corporate Customers',
  'Other',
];

const STYLES = [
  'Modern',
  'Minimal',
  'Professional',
  'Luxury',
  'Elegant',
  'Bold',
  'Creative',
  'Friendly',
  'Corporate',
  'Futuristic',
  'Premium',
];

const COLOR_PREFERENCES = [
  { label: 'AI Decides', hex: '#6366F1' },
  { label: 'Blue', hex: '#3B82F6' },
  { label: 'Purple', hex: '#8B5CF6' },
  { label: 'Green', hex: '#10B981' },
  { label: 'Red', hex: '#EF4444' },
  { label: 'Orange', hex: '#F97316' },
  { label: 'Yellow', hex: '#F59E0B' },
  { label: 'Pink', hex: '#EC4899' },
  { label: 'Black', hex: '#18181B' },
  { label: 'White', hex: '#F4F4F5' },
  { label: 'Custom', hex: '#6366F1' },
];

const LOADING_STEPS = [
  'Analyzing your website...',
  'Understanding your brand...',
  'Building color hierarchy...',
  'Checking accessibility...',
  'Finalizing your professional palette...',
];

export const GeneratorWizard: React.FC = () => {
  const { user, setUser, setActiveSystem, setActiveTab, showToast, refreshData } = useApp();

  const [step, setStep] = useState(1);
  const [websiteName, setWebsiteName] = useState('');
  const [category, setCategory] = useState('SaaS');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('Developers');
  const [style, setStyle] = useState('Modern');
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'both'>('both');
  const [colorPreference, setColorPreference] = useState('AI Decides');
  const [customHex, setCustomHex] = useState('#6366F1');

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Cycle loading messages during generation
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStepIndex(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 1200);
    } else {
      setLoadingStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const canProceed = () => {
    if (step === 1) return websiteName.trim().length > 0;
    if (step === 2) return category !== 'Other' || customCategory.trim().length > 0;
    return true; // description and other steps are optional and have sensible defaults
  };

  const handleNext = () => {
    if (step === 1 && !websiteName.trim()) {
      setErrorMessage('Please type a website name first (e.g. FreshBite, Rizwan Tech).');
      return;
    }
    setErrorMessage('');
    if (step < 7) {
      setStep(step + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleQuickGenerateFromStep1 = () => {
    if (!websiteName.trim()) {
      setErrorMessage('Please enter a website name first.');
      return;
    }
    handleGenerate();
  };

  const handleGenerate = async () => {
    setErrorMessage('');
    setIsGenerating(true);

    const effectiveCategory = category === 'Other' ? customCategory.trim() : category;
    const effectiveColor = colorPreference === 'Custom' ? customHex : colorPreference;

    try {
      const res = await fetch('/api/generate-palette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          websiteName: websiteName.trim(),
          category: effectiveCategory,
          description: description.trim(),
          targetAudience,
          style,
          themePreference,
          colorPreference: effectiveColor,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.limitReached) {
          throw new Error('You have reached your free plan limit of 5 generations this month. Upgrade to Pro for unlimited generations.');
        }
        throw new Error(data.error || 'Generation failed');
      }

      setActiveSystem(data.colorSystem);
      if (user && data.generationsUsed !== undefined) {
        setUser({ ...user, generationsUsed: data.generationsUsed });
      }
      await refreshData();
      showToast('Color system generated successfully!');
      setActiveTab('palette');
    } catch (err: any) {
      setErrorMessage(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="mx-auto max-w-xl py-20 px-4 text-center">
        <div className="relative mx-auto mb-8 h-20 w-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <Wand2 className="h-8 w-8 text-indigo-400 animate-pulse" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          Crafting Color System for {websiteName}
        </h3>
        <p className="text-sm font-medium text-indigo-400 min-h-[24px] transition-all duration-300">
          {LOADING_STEPS[loadingStepIndex]}
        </p>

        <div className="mt-8 flex justify-center gap-1.5">
          {LOADING_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= loadingStepIndex ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
          <span>Step {step} of 7</span>
          <span className="text-slate-300">
            {step === 1 && 'Website Identity'}
            {step === 2 && 'Category & Domain'}
            {step === 3 && 'Vision & Scope'}
            {step === 4 && 'Target Audience'}
            {step === 5 && 'Design Aesthetic'}
            {step === 6 && 'Canvas Theme'}
            {step === 7 && 'Color Tonality'}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-950/40 p-4 text-xs text-rose-300">
          <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-200">Unable to generate</p>
            <p className="mt-1">{errorMessage}</p>
            {errorMessage.includes('limit') && (
              <button
                onClick={() => setActiveTab('pricing')}
                className="mt-2 text-xs font-semibold text-white underline hover:no-underline"
              >
                Upgrade to Pro Plan &rarr;
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-xl">
        {step === 1 && (
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Step 1</span>
            <h2 className="text-xl font-bold text-white mt-1 mb-2">What is the name of your website?</h2>
            <p className="text-xs text-slate-400 mb-6">
              Give your project a recognizable title. The AI evaluates semantic associations with your brand name.
            </p>
            <input
              type="text"
              autoFocus
              value={websiteName}
              onChange={e => {
                setWebsiteName(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              onKeyDown={e => e.key === 'Enter' && handleNext()}
              placeholder="e.g. Rizwan Portfolio, Nimbus Cloud, Velvet Atelier"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-500">Press Enter or click Continue to customize all 7 steps</span>
              <button
                type="button"
                onClick={handleQuickGenerateFromStep1}
                className="flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-950/30 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-950/60 hover:text-white transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>1-Click Generate with Recommended Settings</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Step 2</span>
            <h2 className="text-xl font-bold text-white mt-1 mb-2">Select your website category</h2>
            <p className="text-xs text-slate-400 mb-5">
              Domain standards influence user expectations and color psychological associations.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium text-left transition-colors ${
                    category === cat
                      ? 'border-indigo-500 bg-indigo-950/40 text-white'
                      : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="truncate">{cat}</span>
                  {category === cat && <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />}
                </button>
              ))}
            </div>

            {category === 'Other' && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Specify Custom Category</label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  placeholder="e.g. Drone Logistics, Sustainable Aquaculture"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Step 3</span>
            <h2 className="text-xl font-bold text-white mt-1 mb-2">Describe what your website is about <span className="text-xs font-normal text-slate-400">(Optional)</span></h2>
            <p className="text-xs text-slate-400 mb-5">
              Explain the mission or vibe. If left empty, AI will automatically generate an ideal description based on your category.
            </p>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              onKeyDown={e => (e.ctrlKey || e.metaKey) && e.key === 'Enter' && handleNext()}
              placeholder="e.g. Modern restaurant and cafe with high quality coffee, cozy ambient lighting, and organic pastries."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
            />
          </div>
        )}

        {step === 4 && (
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Step 4</span>
            <h2 className="text-xl font-bold text-white mt-1 mb-2">Who is your target audience?</h2>
            <p className="text-xs text-slate-400 mb-5">
              Visual perception changes across age brackets, professional expectations, and industries.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {AUDIENCES.map(aud => (
                <button
                  key={aud}
                  type="button"
                  onClick={() => setTargetAudience(aud)}
                  className={`flex items-center justify-between rounded-lg border p-3 text-xs font-medium text-left transition-colors ${
                    targetAudience === aud
                      ? 'border-indigo-500 bg-indigo-950/40 text-white'
                      : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{aud}</span>
                  {targetAudience === aud && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Step 5</span>
            <h2 className="text-xl font-bold text-white mt-1 mb-2">Choose the preferred design style</h2>
            <p className="text-xs text-slate-400 mb-5">
              Determines saturation curves, neutral tint warmth, and surface contrast levels.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {STYLES.map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStyle(st)}
                  className={`flex items-center justify-between rounded-lg border p-3 text-xs font-medium text-left transition-colors ${
                    style === st
                      ? 'border-indigo-500 bg-indigo-950/40 text-white'
                      : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{st}</span>
                  {style === st && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Step 6</span>
            <h2 className="text-xl font-bold text-white mt-1 mb-2">Theme Preference</h2>
            <p className="text-xs text-slate-400 mb-5">
              Choose your primary focus. "Both" delivers a full light & dark paired design system.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'Light', desc: 'Airy, high readability canvas' },
                { id: 'dark', label: 'Dark', desc: 'Immersive, sleek slate/void canvas' },
                { id: 'both', label: 'Both', desc: 'Comprehensive dual-mode tokens' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setThemePreference(opt.id as any)}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    themePreference === opt.id
                      ? 'border-indigo-500 bg-indigo-950/40 text-white'
                      : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-sm font-semibold text-white">{opt.label}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 7 && (
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Step 7</span>
            <h2 className="text-xl font-bold text-white mt-1 mb-2">Base Color Preference</h2>
            <p className="text-xs text-slate-400 mb-5">
              Anchor the primary tone or let ColorForge AI determine the best chromatic psychology.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {COLOR_PREFERENCES.map(c => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setColorPreference(c.label)}
                  className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-xs font-medium text-left transition-colors ${
                    colorPreference === c.label
                      ? 'border-indigo-500 bg-indigo-950/40 text-white'
                      : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="truncate">{c.label}</span>
                  {colorPreference === c.label && <Check className="ml-auto h-3 w-3 text-indigo-400 shrink-0" />}
                </button>
              ))}
            </div>

            {colorPreference === 'Custom' && (
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="color"
                  value={customHex}
                  onChange={e => setCustomHex(e.target.value)}
                  className="h-10 w-12 rounded border border-slate-700 bg-slate-950 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={customHex}
                  onChange={e => setCustomHex(e.target.value)}
                  placeholder="#6366F1"
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-white"
                />
              </div>
            )}
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-8 flex items-center justify-between pt-5 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
          >
            {step === 7 ? (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Generate Professional Color System
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
