import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  CheckCircle2,
  Layers,
  ChevronDown,
  ChevronUp,
  Palette,
  Eye,
  Sliders,
  Share2,
  FileCode,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, setUser, setActiveTab, setActiveSystem, setAuthModalOpen, setAuthModalMode, showToast, refreshData } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [quickName, setQuickName] = useState('');
  const [isQuickGenerating, setIsQuickGenerating] = useState(false);
  const [quickError, setQuickError] = useState('');

  const handleQuickRun = async () => {
    const name = quickName.trim();
    if (!name) {
      setQuickError('Please enter a website name (e.g. FreshBite, TechNova)');
      return;
    }
    setQuickError('');
    setIsQuickGenerating(true);

    try {
      const res = await fetch('/api/generate-palette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'user_demo_1',
          websiteName: name,
          category: 'Technology',
          description: `Modern website for ${name}`,
          targetAudience: 'General Audience',
          style: 'Modern',
          themePreference: 'both',
          colorPreference: 'AI Decides',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      setActiveSystem(data.colorSystem);
      if (user && data.generationsUsed !== undefined) {
        setUser({ ...user, generationsUsed: data.generationsUsed });
      }
      await refreshData();
      showToast('Color system generated successfully!');
      setActiveTab('palette');
    } catch (e: any) {
      setQuickError(e.message || 'Generation failed. Please try again.');
    } finally {
      setIsQuickGenerating(false);
    }
  };

  const faqs = [
    {
      q: 'How does ColorForge AI generate color systems rather than random palettes?',
      a: 'Unlike random generators, ColorForge AI performs semantic color theory analysis. It models your website domain, brand persona, target audience, and contrast mathematics to compute harmonic primary anchors, semantic feedback tones, surface elevations, and accessible text scales that meet WCAG standards.',
    },
    {
      q: 'Are the generated colors guaranteed to be WCAG accessible?',
      a: 'Yes. ColorForge calculates the exact relative luminance of every text and surface pair. It evaluates contrast against WCAG 2.1 AA (4.5:1 for body copy) and AAA (7:1) guidelines, alerting you with actionable corrective advice whenever a combination falls below standard.',
    },
    {
      q: 'Can I export the colors directly to Tailwind CSS or CSS Variables?',
      a: 'Absolutely. With a single click you can copy or download CSS Variables (:root and dark mode), Tailwind Config theme extension files, and W3C Design Tokens JSON for tools like Figma, Style Dictionary, or Tokens Studio.',
    },
    {
      q: 'Does it support both Light and Dark modes?',
      a: 'Yes. When you choose "Both", ColorForge AI constructs synchronized light and dark palettes with distinct, balanced background depth, surface contrast, border hairlines, and optical compensation.',
    },
    {
      q: 'Can I refine the palette with natural language?',
      a: 'Yes. Our AI Refinement interface allows you to type prompts like "Make it more luxurious" or "Soft the button borders", and the AI will iteratively adapt the existing palette without resetting your brand identity.',
    },
  ];

  const handleStart = () => {
    if (user) {
      setActiveTab('generator');
    } else {
      setAuthModalMode('register');
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1 text-xs text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI-Powered Website Color & Brand System Generator</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.12]">
            Build the Perfect Website Color System with AI
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed text-balance">
            Tell AI what your website is about. Get a professional, accessible, ready-to-use color system in seconds.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate My Colors</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                if (user) {
                  setActiveTab('layout-generator');
                } else {
                  setAuthModalMode('login');
                  setAuthModalOpen(true);
                }
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-950/30 px-6 py-3.5 text-sm font-semibold text-indigo-300 hover:bg-indigo-900/40 hover:text-white transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>AI Layout Generator</span>
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              See How It Works
            </a>
          </div>

          {/* Quick 1-Click Generator Bar right in Hero */}
          <div className="pt-2 max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch gap-2 rounded-2xl border border-indigo-500/40 bg-slate-900/90 p-2 shadow-2xl">
              <input
                type="text"
                value={quickName}
                onChange={e => setQuickName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleQuickRun()}
                placeholder="Type website name (e.g. FreshBite, Rizwan Tech)..."
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <button
                disabled={isQuickGenerating}
                onClick={handleQuickRun}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap shadow-md shadow-indigo-600/20"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isQuickGenerating ? 'Generating...' : 'Instant Generate'}
              </button>
            </div>
            {quickError && (
              <p className="text-xs text-rose-400 mt-2">{quickError}</p>
            )}
          </div>

          {/* Social Proof Bar */}
          <div className="pt-8 border-t border-slate-800/80 max-w-lg mx-auto flex items-center justify-center gap-6 text-xs text-slate-500 font-mono">
            <span>WCAG AAA Compliant</span>
            <span aria-hidden="true">·</span>
            <span>Tailwind & CSS Tokens</span>
            <span aria-hidden="true">·</span>
            <span>Dual Light/Dark</span>
          </div>
        </div>

        {/* Visual Hero Showcase Artifact */}
        <div className="mt-14 relative rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-2xl overflow-hidden max-w-5xl mx-auto">
          <img
            src="/src/assets/images/showcase_color_palette_1791282060701.jpg"
            alt="Design System Specimen"
            referrerPolicy="no-referrer"
            className="w-full h-80 sm:h-96 object-cover rounded-xl border border-slate-800/80 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-8">
            <div className="text-left space-y-1">
              <span className="text-xs font-mono uppercase text-indigo-400">Harmonized Palette Structure</span>
              <h3 className="text-lg font-bold text-white">Full Design Token Architecture Ready for Production</h3>
              <p className="text-xs text-slate-400 max-w-md">
                18 semantic UI roles, 11-step lightness scales, contrast ratings, and real-time website preview.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section 1: How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Three Simple Steps</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            From Vision to Production System
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A frictionless workflow designed to replace hours of color wheel guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              num: '01',
              title: 'Input Brand Context',
              desc: 'Enter your website title, domain category, design style, target audience, and preferred theme mode.',
            },
            {
              num: '02',
              title: 'AI Color Generation',
              desc: 'The model calculates color psychology, surface contrast, WCAG ratios, and 18 distinct UI roles.',
            },
            {
              num: '03',
              title: 'Preview & Export Tokens',
              desc: 'Interact with the live website mockup, refine through prompt adjustments, and export to CSS or Tailwind.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-3 relative hover:border-slate-700 transition-colors"
            >
              <span className="text-2xl font-black font-mono text-indigo-500/80">{item.num}</span>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Section 2 & 3: AI Color Generation & Professional Color System */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Design Hierarchy</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            18 Semantic UI Roles, Zero Guesswork
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Never wonder which hex code belongs on your primary buttons, secondary borders, or muted captions.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { role: 'Primary', hex: '#6366F1', desc: 'Main brand anchor & CTA' },
            { role: 'Secondary', hex: '#8B5CF6', desc: 'Supporting actions & tags' },
            { role: 'Accent', hex: '#06B6D4', desc: 'High-contrast conversion' },
            { role: 'Background', hex: '#090D16', desc: 'Primary canvas void' },
            { role: 'Surface', hex: '#111827', desc: 'Card containers & modals' },
            { role: 'Border', hex: '#1E293B', desc: 'Hairline structural lines' },
          ].map((c, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-2">
              <div className="h-12 w-full rounded-lg" style={{ backgroundColor: c.hex }} />
              <div>
                <span className="text-xs font-bold text-white block">{c.role}</span>
                <span className="text-[10px] font-mono text-slate-400 block">{c.hex}</span>
                <span className="text-[10px] text-slate-500 block mt-1 line-clamp-1">{c.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Section 4: Live Website Preview Showcase */}
      <section id="preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Interactive Validation</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Live Interactive Website Preview
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Watch your generated palette instantly populate actual UI components: Navbars, Hero sections, call-to-action buttons, feature cards, and footers.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Desktop, Tablet, and Mobile viewports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Instant 1-click theme switching (Light vs Dark)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Natural-language chat refinement in real time</span>
                </li>
              </ul>
              <button
                onClick={handleStart}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Launch Studio & Test &rarr;
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-xl space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-slate-400 pb-2 border-b border-slate-800">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Real-Time Component Sync Engine</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-400">
                <div className="p-2 rounded bg-slate-900 text-indigo-300">--color-primary: #6366F1;</div>
                <div className="p-2 rounded bg-slate-900 text-slate-300">--color-background: #090D16;</div>
                <div className="p-2 rounded bg-slate-900 text-cyan-300">--color-accent: #06B6D4;</div>
                <div className="p-2 rounded bg-slate-900 text-emerald-300">WCAG AA Ratio: 14.8:1 (AAA Pass)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section 5: Accessibility Checker */}
      <section id="accessibility" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Inclusive Design</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Built-In WCAG 2.1 Accessibility Auditor
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Automated verification of text against backgrounds, buttons, links, and muted captions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">AAA Rating (7:1+)</span>
            <h4 className="text-base font-bold text-white">Enhanced Contrast</h4>
            <p className="text-xs text-slate-400">
              Guarantees comfort and effortless scannability for all screen brightness levels and ambient lighting.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-6 space-y-2">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase">AA Rating (4.5:1+)</span>
            <h4 className="text-base font-bold text-white">Standard Compliance</h4>
            <p className="text-xs text-slate-400">
              The required baseline for web accessibility across body text, input labels, and interactive links.
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-6 space-y-2">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase">Automated Correction</span>
            <h4 className="text-base font-bold text-white">Actionable Fix Tips</h4>
            <p className="text-xs text-slate-400">
              If any color combination fails, ColorForge AI provides the precise luminosity delta adjustment required.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Section 6: Export & Share */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Developer Hand-Off</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Export to Modern Frameworks in Seconds
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Plug straight into your codebase without manual hex re-typing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'CSS Variables', desc: ':root and media query ready with full dark mode tokens.', icon: FileCode },
            { title: 'Tailwind Config', desc: 'theme.extend.colors mapped with complete 50-950 scales.', icon: Code2 },
            { title: 'W3C Design Tokens', desc: 'Community Group specification for tokens studio & Figma.', icon: Layers },
            { title: 'Raw JSON Format', desc: 'Complete structured schema for headless consumption.', icon: Share2 },
          ].map((exp, i) => {
            const Icon = exp.icon;
            return (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
                <Icon className="h-6 w-6 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">{exp.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{exp.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Section 7: Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Pricing</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Start Free, Scale as Needed
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            5 free generations every month. Upgrade for unlimited generations and deep AI refinement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <span className="text-xs font-mono text-slate-400 uppercase">Starter</span>
            <h3 className="text-xl font-bold text-white">$0 <span className="text-xs font-normal text-slate-500">/ forever</span></h3>
            <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 5 generations / month</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> CSS export</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Save up to 5 projects</li>
            </ul>
            <button
              onClick={handleStart}
              className="w-full py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Get Started Free
            </button>
          </div>

          <div className="rounded-2xl border-2 border-indigo-500 bg-slate-900 p-6 space-y-4 relative shadow-xl">
            <span className="absolute -top-3 right-6 text-[10px] font-mono font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">POPULAR</span>
            <span className="text-xs font-mono text-indigo-400 uppercase">Pro Studio</span>
            <h3 className="text-xl font-bold text-white">$29 <span className="text-xs font-normal text-slate-500">/ month</span></h3>
            <ul className="text-xs text-slate-200 space-y-2 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Unlimited AI generations</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Iterative chat refinement</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Tailwind, JSON, and W3C tokens</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Full 11-step color scales</li>
            </ul>
            <button
              onClick={handleStart}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
            >
              Start Free & Upgrade
            </button>
          </div>
        </div>
      </section>

      {/* 8. Section 8: FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Frequently Asked Questions</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3 pt-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" /> : <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-10 sm:p-14 text-center space-y-5 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">
            Design Your Website Color System Now
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto text-balance">
            Stop guessing hex codes. Get an accessible, mathematically calibrated brand palette ready for implementation.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleStart}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
            >
              <span>Get Started with ColorForge AI</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} ColorForge AI. Production-grade brand color systems.
        </div>
        <div className="flex items-center gap-6">
          <a href="#how-it-works" className="hover:text-slate-300">How It Works</a>
          <a href="#features" className="hover:text-slate-300">Features</a>
          <a href="#pricing" className="hover:text-slate-300">Pricing</a>
          <a href="#faq" className="hover:text-slate-300">FAQ</a>
        </div>
      </footer>
    </div>
  );
};
