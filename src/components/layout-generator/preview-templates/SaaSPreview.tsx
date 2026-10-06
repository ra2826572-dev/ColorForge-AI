import React, { useState } from 'react';
import { GeneratedLayoutSystem } from '../../../types/colorforge';
import {
  Sparkles,
  ArrowRight,
  Check,
  ChevronDown,
  Shield,
  Zap,
  Layers,
  Star,
  Users,
  BarChart3,
  Globe,
  Terminal,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface PreviewProps {
  system: GeneratedLayoutSystem;
  fontFamily: string;
}

export const SaaSPreview: React.FC<PreviewProps> = ({ system, fontFamily }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'analytics' | 'workflows' | 'security'>('analytics');

  const c = system.colors;
  const d = system.analysis.derivedColors;
  const r = system.borderRadius;

  const faqs = [
    {
      q: 'How does ColorForge design system integrate into our existing stack?',
      a: 'Export ready-to-use Tailwind config tokens, CSS variables, or React components with one click. Everything is synchronized with your CI/CD.',
    },
    {
      q: 'Can we customize contrast compliance rules for WCAG AAA?',
      a: 'Yes. ColorForge automatically enforces WCAG AAA for high-compliance healthcare and financial environments, with automated ratio recalculation.',
    },
    {
      q: 'Does it support multi-brand and dark/light switching?',
      a: 'Absolutely. Every generated system computes paired semantic roles for light and dark environments with mathematically verified luminance steps.',
    },
    {
      q: 'Can team members share and edit palettes in real time?',
      a: 'Teams on the Pro plan can invite unlimited collaborators, share public read-only review links, and maintain project libraries.',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: c.background,
        color: c.text,
        fontFamily,
      }}
      className="w-full flex flex-col transition-colors duration-200"
    >
      {/* Top Banner */}
      <div
        style={{
          backgroundColor: d.subtleBg,
          borderBottom: `1px solid ${d.cardBorder}`,
          color: d.badgeText,
        }}
        className="px-4 py-2 text-center text-xs font-medium flex items-center justify-center gap-2"
      >
        <span
          style={{ backgroundColor: c.accent, color: c.background }}
          className="px-2 py-0.5 rounded-full text-[10px] font-bold"
        >
          NEW
        </span>
        <span>Version 3.2 just released with AI Design System tokens & instant Figma exports</span>
        <ArrowRight className="h-3 w-3" />
      </div>

      {/* Navbar */}
      <nav
        style={{
          backgroundColor: c.surface,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5 font-black text-lg tracking-tight">
            <div
              style={{ backgroundColor: c.primary, borderRadius: r }}
              className="w-8 h-8 flex items-center justify-center text-white shadow-md font-bold text-sm"
            >
              {system.websiteName.charAt(0)}
            </div>
            <span>{system.websiteName}</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold" style={{ color: d.mutedText }}>
            <span className="hover:text-white cursor-pointer transition-colors" style={{ color: c.text }}>Platform</span>
            <span className="hover:text-white cursor-pointer transition-colors">Solutions</span>
            <span className="hover:text-white cursor-pointer transition-colors">Integrations</span>
            <span className="hover:text-white cursor-pointer transition-colors">Pricing</span>
            <span className="hover:text-white cursor-pointer transition-colors">Docs</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            style={{ color: c.text }}
            className="text-xs font-semibold px-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
          >
            Sign In
          </button>
          <button
            style={{
              backgroundColor: c.primary,
              borderRadius: r,
              boxShadow: `0 4px 14px ${d.primaryGlowRgba}`,
            }}
            className="px-4 py-2 text-xs font-bold text-white hover:opacity-95 transition-all shadow-md active:scale-95"
          >
            Start Free Trial
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-12 max-w-6xl mx-auto w-full text-center">
        <div
          style={{
            backgroundColor: d.badgeBg,
            borderColor: d.cardBorder,
            color: d.badgeText,
          }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-6 shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5" style={{ color: c.accent }} />
          <span>Next-Generation Intelligence for Modern Product Teams</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
          Architect Beautiful Software Systems <span style={{ color: c.primary }}>at Lightning Speed</span>
        </h1>

        <p
          style={{ color: d.mutedText }}
          className="text-base sm:text-lg max-w-2xl mx-auto mb-8 font-normal leading-relaxed"
        >
          Unify your design tokens, component libraries, and automated workflows.
          Eliminate manual handoffs with real-time synchronized production tokens.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button
            style={{
              backgroundColor: c.primary,
              borderRadius: r,
              boxShadow: `0 8px 24px ${d.primaryGlowRgba}`,
            }}
            className="px-6 py-3.5 text-sm font-bold text-white hover:opacity-95 transition-all flex items-center gap-2 shadow-xl active:scale-95"
          >
            <span>Start Building for Free</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            style={{
              backgroundColor: c.surface,
              borderColor: d.cardBorder,
              borderRadius: r,
            }}
            className="px-6 py-3.5 text-sm font-semibold border hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
          >
            <span>Book Live Demo</span>
            <ExternalLink className="h-3.5 w-3.5" style={{ color: d.mutedText }} />
          </button>
        </div>

        {/* Interactive Mock Product Dashboard Widget */}
        <div
          style={{
            backgroundColor: c.surface,
            borderColor: d.cardBorder,
            borderRadius: r,
            boxShadow: `0 20px 50px ${d.shadowRgba}`,
          }}
          className="w-full border p-4 sm:p-6 text-left overflow-hidden relative"
        >
          {/* Header Bar */}
          <div
            style={{ borderBottom: `1px solid ${d.cardBorder}` }}
            className="pb-4 mb-6 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono font-medium" style={{ color: d.mutedText }}>
                app.{system.websiteName.toLowerCase().replace(/\s+/g, '')}.io/console
              </span>
            </div>

            <div className="flex items-center gap-2">
              {(['analytics', 'workflows', 'security'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    backgroundColor: activeTab === tab ? c.primary : 'transparent',
                    color: activeTab === tab ? '#FFFFFF' : d.mutedText,
                    borderRadius: r,
                  }}
                  className="px-3 py-1 text-xs font-semibold capitalize transition-all"
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div
              style={{
                backgroundColor: d.subtleBg,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="p-4 border"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: d.mutedText }}>
                Total Active Deployments
              </div>
              <div className="text-2xl font-black mb-2">1,482,920</div>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: c.accent }}>
                <Zap className="h-3.5 w-3.5" />
                <span>+24.6% vs last week</span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: d.subtleBg,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="p-4 border"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: d.mutedText }}>
                Median Build Latency
              </div>
              <div className="text-2xl font-black mb-2" style={{ color: c.primary }}>
                48ms
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: d.badgeText }}>
                <Check className="h-3.5 w-3.5" />
                <span>Zero cache misses</span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: d.subtleBg,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="p-4 border"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: d.mutedText }}>
                Compliance Health
              </div>
              <div className="text-2xl font-black mb-2">99.99%</div>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: c.secondary }}>
                <Shield className="h-3.5 w-3.5" />
                <span>SOC2 Type II & WCAG AAA</span>
              </div>
            </div>
          </div>

          {/* Visual Chart Bars preview */}
          <div
            style={{
              backgroundColor: d.subtleBg,
              borderColor: d.cardBorder,
              borderRadius: r,
            }}
            className="mt-4 p-4 border"
          >
            <div className="flex items-center justify-between text-xs font-semibold mb-3">
              <span>Traffic & Throughput Stream</span>
              <span style={{ color: c.accent }}>Live 1s interval</span>
            </div>
            <div className="flex items-end gap-2 h-20 w-full pt-4">
              {[42, 68, 55, 89, 74, 95, 62, 85, 99, 70, 88, 94, 60, 78, 92, 84, 96].map((h, i) => (
                <div
                  key={i}
                  style={{
                    height: `${h}%`,
                    backgroundColor: i === 8 || i === 11 ? c.accent : i % 2 === 0 ? c.primary : c.secondary,
                    borderRadius: '3px',
                  }}
                  className="flex-1 transition-all hover:opacity-80"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="px-6 py-16 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">Everything Engineered for Peak Velocity</h2>
          <p style={{ color: d.mutedText }} className="text-sm">
            Purpose-built components designed to scale from zero to millions of daily requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            style={{
              backgroundColor: c.surface,
              borderColor: d.cardBorder,
              borderRadius: r,
            }}
            className="p-6 border shadow-sm hover:border-indigo-500/40 transition-colors"
          >
            <div
              style={{ backgroundColor: d.badgeBg, color: c.primary, borderRadius: r }}
              className="w-12 h-12 flex items-center justify-center font-bold mb-4"
            >
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Automated Token Sync</h3>
            <p style={{ color: d.mutedText }} className="text-xs leading-relaxed">
              Generate unified color tokens across React, iOS, Android, and Figma without manual synchronization.
            </p>
          </div>

          <div
            style={{
              backgroundColor: c.surface,
              borderColor: d.cardBorder,
              borderRadius: r,
            }}
            className="p-6 border shadow-sm hover:border-indigo-500/40 transition-colors"
          >
            <div
              style={{ backgroundColor: d.badgeBg, color: c.secondary, borderRadius: r }}
              className="w-12 h-12 flex items-center justify-center font-bold mb-4"
            >
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Strict WCAG Guardrails</h3>
            <p style={{ color: d.mutedText }} className="text-xs leading-relaxed">
              Every role is mathematically tested for contrast compliance before deployment to prevent accessibility debt.
            </p>
          </div>

          <div
            style={{
              backgroundColor: c.surface,
              borderColor: d.cardBorder,
              borderRadius: r,
            }}
            className="p-6 border shadow-sm hover:border-indigo-500/40 transition-colors"
          >
            <div
              style={{ backgroundColor: d.badgeBg, color: c.accent, borderRadius: r }}
              className="w-12 h-12 flex items-center justify-center font-bold mb-4"
            >
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Full Component Architecture</h3>
            <p style={{ color: d.mutedText }} className="text-xs leading-relaxed">
              Export copy-paste components with pre-wired button states, hover actions, and accessible focus rings.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Pricing Section */}
      <section
        style={{ backgroundColor: d.subtleBg, borderTop: `1px solid ${d.cardBorder}`, borderBottom: `1px solid ${d.cardBorder}` }}
        className="px-6 py-16"
      >
        <div className="max-w-5xl mx-auto w-full text-center">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">Transparent, Predictable Pricing</h2>
          <p style={{ color: d.mutedText }} className="text-sm max-w-lg mx-auto mb-6">
            Scale seamlessly from individual side projects to enterprise organizations.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-full border mb-12" style={{ backgroundColor: c.surface, borderColor: d.cardBorder }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                backgroundColor: billingCycle === 'monthly' ? c.primary : 'transparent',
                color: billingCycle === 'monthly' ? '#FFFFFF' : d.mutedText,
              }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              style={{
                backgroundColor: billingCycle === 'annual' ? c.primary : 'transparent',
                color: billingCycle === 'annual' ? '#FFFFFF' : d.mutedText,
              }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>Annual Billing</span>
              <span style={{ backgroundColor: c.accent, color: c.background }} className="px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                Save 20%
              </span>
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Starter */}
            <div
              style={{
                backgroundColor: c.surface,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="p-6 border flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold mb-1">Starter</h3>
                <p style={{ color: d.mutedText }} className="text-xs mb-4">For solo developers and prototypes</p>
                <div className="text-3xl font-black mb-6">
                  {billingCycle === 'annual' ? '$19' : '$24'}
                  <span className="text-xs font-normal" style={{ color: d.mutedText }}> /month</span>
                </div>
                <div className="space-y-2 text-xs" style={{ color: d.mutedText }}>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4" style={{ color: c.primary }} /> <span>Up to 10 active color systems</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4" style={{ color: c.primary }} /> <span>Tailwind & CSS Variables export</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4" style={{ color: c.primary }} /> <span>Standard WCAG validation</span></div>
                </div>
              </div>
              <button
                style={{
                  backgroundColor: d.subtleBg,
                  borderColor: d.cardBorder,
                  borderRadius: r,
                }}
                className="mt-8 w-full py-2.5 text-xs font-bold border hover:opacity-80 transition-all"
              >
                Get Started
              </button>
            </div>

            {/* Pro (Highlighted) */}
            <div
              style={{
                backgroundColor: c.surface,
                borderColor: c.primary,
                borderRadius: r,
                boxShadow: `0 12px 30px ${d.primaryGlowRgba}`,
              }}
              className="p-6 border-2 flex flex-col justify-between relative"
            >
              <div
                style={{ backgroundColor: c.primary, color: '#FFFFFF' }}
                className="absolute -top-3 right-6 px-3 py-0.5 text-[10px] font-bold uppercase rounded-full shadow-md"
              >
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Professional</h3>
                <p style={{ color: d.mutedText }} className="text-xs mb-4">For scaling product teams</p>
                <div className="text-3xl font-black mb-6">
                  {billingCycle === 'annual' ? '$49' : '$59'}
                  <span className="text-xs font-normal" style={{ color: d.mutedText }}> /month</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2"><Check className="h-4 w-4" style={{ color: c.primary }} /> <span>Unlimited generated systems</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4" style={{ color: c.primary }} /> <span>Live Website Layout Generation</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4" style={{ color: c.primary }} /> <span>Figma plugin integration</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4" style={{ color: c.primary }} /> <span>Priority AI generation speed</span></div>
                </div>
              </div>
              <button
                style={{
                  backgroundColor: c.primary,
                  borderRadius: r,
                }}
                className="mt-8 w-full py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-95 transition-all"
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise */}
            <div
              style={{
                backgroundColor: c.surface,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="p-6 border flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold mb-1">Enterprise</h3>
                <p style={{ color: d.mutedText }} className="text-xs mb-4">For large-scale design organizations</p>
                <div className="text-3xl font-black mb-6">
                  Custom
                </div>
                <div className="space-y-2 text-xs" style={{ color: d.mutedText }}>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4" style={{ color: c.primary }} /> <span>Custom model fine-tuning</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4" style={{ color: c.primary }} /> <span>Dedicated SLA & 99.99% uptime</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4" style={{ color: c.primary }} /> <span>SSO & custom role governance</span></div>
                </div>
              </div>
              <button
                style={{
                  backgroundColor: d.subtleBg,
                  borderColor: d.cardBorder,
                  borderRadius: r,
                }}
                className="mt-8 w-full py-2.5 text-xs font-bold border hover:opacity-80 transition-all"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="px-6 py-16 max-w-4xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: c.surface,
                  borderColor: d.cardBorder,
                  borderRadius: r,
                }}
                className="border overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    style={{ color: c.primary }}
                  />
                </button>
                {isOpen && (
                  <div
                    style={{
                      borderTop: `1px solid ${d.cardBorder}`,
                      color: d.mutedText,
                    }}
                    className="p-4 text-xs leading-relaxed"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: c.surface,
          borderTop: `1px solid ${d.cardBorder}`,
        }}
        className="px-6 py-12 max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
      >
        <div className="flex items-center gap-2 font-bold">
          <div
            style={{ backgroundColor: c.primary, borderRadius: r }}
            className="w-6 h-6 flex items-center justify-center text-white text-[10px]"
          >
            {system.websiteName.charAt(0)}
          </div>
          <span>{system.websiteName}</span>
        </div>
        <div className="flex items-center gap-6" style={{ color: d.mutedText }}>
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
          <span className="hover:text-white cursor-pointer">Security</span>
          <span className="hover:text-white cursor-pointer">API Reference</span>
        </div>
        <div style={{ color: d.mutedText }}>
          &copy; {new Date().getFullYear()} {system.websiteName}. Generated with ColorForge AI.
        </div>
      </footer>
    </div>
  );
};
