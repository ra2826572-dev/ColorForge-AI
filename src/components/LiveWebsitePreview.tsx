import React, { useState } from 'react';
import { ColorSystem, PaletteTheme } from '../types/colorforge';
import { Monitor, Tablet, Smartphone, Sparkles, Wand2, Shield, Zap, Layers, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LiveWebsitePreviewProps {
  system: ColorSystem;
  onQuickRefine: (prompt: string) => void;
  isRefining: boolean;
}

export const LiveWebsitePreview: React.FC<LiveWebsitePreviewProps> = ({
  system,
  onQuickRefine,
  isRefining,
}) => {
  const { showToast, setActiveTab } = useApp();
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Active theme based on system activeTheme
  const p: PaletteTheme = system.activeTheme === 'dark' ? system.darkPalette : system.lightPalette;

  const quickRefinements = [
    { label: 'Make It More Premium', prompt: 'Make it more luxurious, sophisticated, and premium with deeper rich tones.' },
    { label: 'Make It More Minimal', prompt: 'Make it more minimal, muted, and clean with reduced saturation.' },
    { label: 'Make It More Colorful', prompt: 'Make it more vibrant, colorful, and energetic with punchy accents.' },
    { label: 'Make It Darker', prompt: 'Make the canvas darker and elevate contrast of text and badges.' },
    { label: 'Make It Lighter', prompt: 'Make the overall tone softer, lighter, and friendlier.' },
    { label: 'Try Another Style', prompt: 'Re-envision the style for a futuristic, modern tech aesthetic.' },
  ];

  const getContainerWidth = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[390px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'w-full';
    }
  };

  return (
    <div className="space-y-4">
      {/* Viewport & Refine Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                device === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              Desktop
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                device === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tablet className="h-3.5 w-3.5" />
              Tablet
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                device === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile
            </button>
          </div>

          <button
            onClick={() => setActiveTab('layout-generator')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Open Full AI Layout Generator</span>
          </button>
        </div>

        {/* Quick Style AI Adjusters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {quickRefinements.map(r => (
            <button
              key={r.label}
              disabled={isRefining}
              onClick={() => onQuickRefine(r.prompt)}
              className="whitespace-nowrap rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-indigo-500/50 hover:text-white transition-colors disabled:opacity-50"
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex justify-center rounded-2xl border border-slate-800/80 bg-slate-950/60 p-2 sm:p-6 shadow-inner overflow-hidden">
        <div
          className={`${getContainerWidth()} transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col`}
          style={{ backgroundColor: p.background.hex, color: p.text.hex }}
        >
          {/* Mock Browser Header Bar */}
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{
              backgroundColor: p.surface.hex,
              borderColor: p.border.hex,
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div
              className="text-[11px] font-mono px-3 py-0.5 rounded border truncate max-w-xs"
              style={{
                backgroundColor: p.background.hex,
                borderColor: p.border.hex,
                color: p.mutedText.hex,
              }}
            >
              https://{system.websiteName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
            </div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold" style={{ color: p.primary.hex }}>
              {system.activeTheme.toUpperCase()}
            </span>
          </div>

          {/* 1. Preview Navbar */}
          <nav
            className="flex items-center justify-between px-6 py-4 border-b transition-colors"
            style={{
              backgroundColor: p.surface.hex,
              borderColor: p.border.hex,
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: p.primary.hex }}
              />
              <span className="font-bold text-sm tracking-tight" style={{ color: p.text.hex }}>
                {system.websiteName}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-5 text-xs font-medium">
              <span style={{ color: p.text.hex }}>Platform</span>
              <span style={{ color: p.mutedText.hex }}>Solutions</span>
              <span style={{ color: p.mutedText.hex }}>Pricing</span>
              <span style={{ color: p.mutedText.hex }}>Docs</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs font-medium cursor-pointer" style={{ color: p.link.hex }}>
                Sign In
              </span>
              <button
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-transform hover:scale-[1.02]"
                style={{
                  backgroundColor: p.button.hex,
                  color: p.buttonText.hex,
                }}
              >
                Get Started
              </button>
            </div>
          </nav>

          {/* 2. Hero Section */}
          <div className="px-6 py-12 sm:py-16 text-center max-w-2xl mx-auto space-y-5">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
              style={{
                backgroundColor: p.surface.hex,
                borderColor: p.border.hex,
                color: p.secondary.hex,
              }}
            >
              <Sparkles className="h-3 w-3" style={{ color: p.accent.hex }} />
              <span>Next-Generation {system.category} Infrastructure</span>
            </div>

            <h1
              className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight"
              style={{ color: p.text.hex }}
            >
              Engineered for absolute speed and flawless reliability.
            </h1>

            <p className="text-xs sm:text-sm leading-relaxed max-w-lg mx-auto" style={{ color: p.mutedText.hex }}>
              {system.description} Empowering {system.targetAudience} with precision intelligence, accessible architecture, and unmatched speed.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.02] shadow-sm"
                style={{
                  backgroundColor: p.button.hex,
                  color: p.buttonText.hex,
                }}
              >
                Start Free Trial
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                className="px-4 py-2.5 rounded-lg text-xs font-semibold border transition-colors"
                style={{
                  backgroundColor: p.surface.hex,
                  borderColor: p.border.hex,
                  color: p.text.hex,
                }}
              >
                Schedule Demo
              </button>
            </div>
          </div>

          {/* 3. Feature Cards Section */}
          <div
            className="px-6 py-10 border-t"
            style={{
              backgroundColor: p.surface.hex,
              borderColor: p.border.hex,
            }}
          >
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold" style={{ color: p.text.hex }}>
                Built with precision engineering
              </h3>
              <p className="text-xs mt-1" style={{ color: p.mutedText.hex }}>
                Every component is harmonized according to your custom {system.style} brand system.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Zap,
                  title: 'Ultra Latency',
                  desc: 'Sub-millisecond responsiveness with distributed edge execution.',
                  badge: 'Fast',
                },
                {
                  icon: Shield,
                  title: 'Security Hardened',
                  desc: 'Enterprise role isolation and full cryptographic invariant checks.',
                  badge: 'Secure',
                },
                {
                  icon: Layers,
                  title: 'Scalable Systems',
                  desc: 'Effortless horizontal growth for global teams and critical workflows.',
                  badge: 'Dynamic',
                },
              ].map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={i}
                    className="p-5 rounded-xl border transition-all"
                    style={{
                      backgroundColor: p.card.hex,
                      borderColor: p.border.hex,
                    }}
                  >
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center mb-3"
                      style={{
                        backgroundColor: p.background.hex,
                        color: p.primary.hex,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-xs font-bold" style={{ color: p.text.hex }}>
                      {feat.title}
                    </h4>
                    <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: p.mutedText.hex }}>
                      {feat.desc}
                    </p>
                    <div className="mt-3">
                      <span
                        className="text-[10px] font-mono font-semibold"
                        style={{ color: p.link.hex }}
                      >
                        Explore details &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. About & Metrics Callout */}
          <div className="px-6 py-10">
            <div
              className="p-6 rounded-xl border grid grid-cols-2 sm:grid-cols-4 gap-4 text-center"
              style={{
                backgroundColor: p.surface.hex,
                borderColor: p.border.hex,
              }}
            >
              <div>
                <p className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums" style={{ color: p.primary.hex }}>
                  99.99%
                </p>
                <p className="text-[11px] mt-1" style={{ color: p.mutedText.hex }}>Uptime Guarantee</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums" style={{ color: p.secondary.hex }}>
                  &lt;15ms
                </p>
                <p className="text-[11px] mt-1" style={{ color: p.mutedText.hex }}>Average Latency</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums" style={{ color: p.accent.hex }}>
                  250K+
                </p>
                <p className="text-[11px] mt-1" style={{ color: p.mutedText.hex }}>Systems Powered</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums" style={{ color: p.success.hex }}>
                  AAA
                </p>
                <p className="text-[11px] mt-1" style={{ color: p.mutedText.hex }}>WCAG Compliance</p>
              </div>
            </div>
          </div>

          {/* 5. Pricing Cards */}
          <div
            className="px-6 py-10 border-t"
            style={{
              backgroundColor: p.surface.hex,
              borderColor: p.border.hex,
            }}
          >
            <div className="text-center mb-7">
              <h3 className="text-base font-bold" style={{ color: p.text.hex }}>
                Simple, predictable investment
              </h3>
              <p className="text-xs mt-1" style={{ color: p.mutedText.hex }}>
                Choose the plan that powers your team.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <div
                className="p-5 rounded-xl border flex flex-col justify-between"
                style={{
                  backgroundColor: p.card.hex,
                  borderColor: p.border.hex,
                }}
              >
                <div>
                  <span className="text-xs font-semibold" style={{ color: p.text.hex }}>Starter Tier</span>
                  <p className="text-xl font-extrabold font-mono my-2" style={{ color: p.text.hex }}>$29<span className="text-xs font-normal" style={{ color: p.mutedText.hex }}>/mo</span></p>
                  <ul className="text-[11px] space-y-1.5 mt-3" style={{ color: p.mutedText.hex }}>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" style={{ color: p.success.hex }} /> Up to 5 projects</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" style={{ color: p.success.hex }} /> Full CSS token export</li>
                  </ul>
                </div>
                <button
                  className="mt-5 w-full py-2 rounded-lg text-xs font-semibold border transition-colors"
                  style={{
                    backgroundColor: p.surface.hex,
                    borderColor: p.border.hex,
                    color: p.text.hex,
                  }}
                >
                  Choose Starter
                </button>
              </div>

              <div
                className="p-5 rounded-xl border relative shadow-md flex flex-col justify-between"
                style={{
                  backgroundColor: p.card.hex,
                  borderColor: p.primary.hex,
                }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: p.text.hex }}>Pro Platform</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: p.primary.hex, color: p.buttonText.hex }}>POPULAR</span>
                  </div>
                  <p className="text-xl font-extrabold font-mono my-2" style={{ color: p.text.hex }}>$79<span className="text-xs font-normal" style={{ color: p.mutedText.hex }}>/mo</span></p>
                  <ul className="text-[11px] space-y-1.5 mt-3" style={{ color: p.mutedText.hex }}>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" style={{ color: p.success.hex }} /> Unlimited projects</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" style={{ color: p.success.hex }} /> Real-time AI refinement</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" style={{ color: p.success.hex }} /> Tailwind & W3C tokens</li>
                  </ul>
                </div>
                <button
                  className="mt-5 w-full py-2 rounded-lg text-xs font-bold transition-transform hover:scale-[1.02]"
                  style={{
                    backgroundColor: p.button.hex,
                    color: p.buttonText.hex,
                  }}
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>

          {/* 6. Testimonials */}
          <div className="px-6 py-10 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="h-3.5 w-3.5 fill-current" style={{ color: p.warning.hex }} />
              ))}
            </div>
            <p className="text-xs sm:text-sm font-medium italic max-w-md mx-auto" style={{ color: p.text.hex }}>
              "This color system completely transformed our website readability and brand resonance. Our conversion jumped 32% within two weeks."
            </p>
            <p className="text-[11px] font-semibold mt-3" style={{ color: p.mutedText.hex }}>
              Elena Rostova <span aria-hidden="true">·</span> Head of Product Design
            </p>
          </div>

          {/* 7. Preview Footer */}
          <footer
            className="px-6 py-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]"
            style={{
              backgroundColor: p.surface.hex,
              borderColor: p.border.hex,
              color: p.mutedText.hex,
            }}
          >
            <div>
              &copy; {new Date().getFullYear()} {system.websiteName}. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span className="cursor-pointer" style={{ color: p.link.hex }}>Privacy</span>
              <span className="cursor-pointer" style={{ color: p.link.hex }}>Terms</span>
              <span className="cursor-pointer" style={{ color: p.link.hex }}>Status</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
