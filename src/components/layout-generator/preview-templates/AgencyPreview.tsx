import React from 'react';
import { GeneratedLayoutSystem } from '../../../types/colorforge';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Zap,
  TrendingUp,
  Award,
  Globe,
  CheckCircle,
} from 'lucide-react';

interface PreviewProps {
  system: GeneratedLayoutSystem;
  fontFamily: string;
}

export const AgencyPreview: React.FC<PreviewProps> = ({ system, fontFamily }) => {
  const c = system.colors;
  const d = system.analysis.derivedColors;
  const r = system.borderRadius;

  return (
    <div
      style={{
        backgroundColor: c.background,
        color: c.text,
        fontFamily,
      }}
      className="w-full flex flex-col transition-colors duration-200"
    >
      {/* Top Navigation */}
      <header
        style={{
          backgroundColor: c.surface,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3 font-black text-lg">
          <div
            style={{ backgroundColor: c.primary, borderRadius: r }}
            className="w-8 h-8 flex items-center justify-center text-white text-xs font-black shadow-md"
          >
            {system.websiteName.charAt(0)}
          </div>
          <span>{system.websiteName}</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold" style={{ color: d.mutedText }}>
          <span className="hover:text-white cursor-pointer" style={{ color: c.text }}>Case Studies</span>
          <span className="hover:text-white cursor-pointer">Capabilities</span>
          <span className="hover:text-white cursor-pointer">Our Method</span>
          <span className="hover:text-white cursor-pointer">About Studio</span>
        </nav>

        <button
          style={{
            backgroundColor: c.primary,
            borderRadius: r,
          }}
          className="px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
        >
          <span>Start a Project</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-16 max-w-6xl mx-auto w-full text-center">
        <div
          style={{
            backgroundColor: d.badgeBg,
            borderColor: d.cardBorder,
            color: d.badgeText,
          }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-6"
        >
          <Award className="h-3.5 w-3.5" style={{ color: c.accent }} />
          <span>Recognized by FastCompany & Awwwards Studio of the Year</span>
        </div>

        <h1 className="text-4xl sm:text-7xl font-black tracking-tight leading-[1.05] max-w-5xl mx-auto mb-8">
          We Build Digital Brands <span style={{ color: c.primary }}>That Outperform</span> Their Industry.
        </h1>

        <p
          style={{ color: d.mutedText }}
          className="text-base sm:text-xl max-w-2xl mx-auto mb-10 font-normal leading-relaxed"
        >
          A strategic creative consultancy combining brand identity, generative intelligence, and high-performance engineering for market leaders.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            style={{
              backgroundColor: c.primary,
              borderRadius: r,
              boxShadow: `0 8px 24px ${d.primaryGlowRgba}`,
            }}
            className="px-7 py-3.5 text-sm font-bold text-white shadow-xl hover:opacity-95 transition-all flex items-center gap-2"
          >
            <span>Explore Our Portfolio</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            style={{
              backgroundColor: c.surface,
              borderColor: d.cardBorder,
              borderRadius: r,
            }}
            className="px-7 py-3.5 text-sm font-semibold border hover:opacity-90 transition-all"
          >
            Capabilities Deck
          </button>
        </div>

        {/* Client Logos / Social Proof */}
        <div
          style={{
            borderTop: `1px solid ${d.cardBorder}`,
            borderBottom: `1px solid ${d.cardBorder}`,
          }}
          className="py-8"
        >
          <p className="text-[11px] font-mono uppercase tracking-widest mb-6" style={{ color: d.mutedText }}>
            Trusted by iconic ventures worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 font-black text-sm tracking-wider opacity-60">
            <span>VOLT AUDIO</span>
            <span>NEXUS CLOUD</span>
            <span>AEROSPACE AI</span>
            <span>STRATA LABS</span>
            <span>MONARCH LUXURY</span>
          </div>
        </div>
      </section>

      {/* Case Studies Showcase */}
      <section className="px-6 py-16 max-w-6xl mx-auto w-full">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Recent Deployments</h2>
            <p style={{ color: d.mutedText }} className="text-xs mt-1">Measurable outcomes and global brand transformations</p>
          </div>
          <span style={{ color: c.accent }} className="text-xs font-bold cursor-pointer hover:underline">
            View All 42 Releases &rarr;
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'Rewriting Financial Architecture for Apex Bank',
              metric: '+310% App Conversions',
              category: 'Fintech & Design Systems',
              color: c.primary,
            },
            {
              title: 'Re-imagining Electric Mobility for Rivian OS',
              metric: '4.9/5 Driver Satisfaction',
              category: 'Spatial UI & Hardware HMI',
              color: c.secondary,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: c.surface,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="border p-6 rounded-2xl flex flex-col justify-between group hover:border-indigo-500/50 transition-all"
            >
              <div
                style={{
                  backgroundColor: d.subtleBg,
                  borderRadius: r,
                  border: `1px solid ${d.cardBorder}`,
                }}
                className="h-48 w-full flex items-center justify-center mb-6 relative overflow-hidden"
              >
                <div
                  style={{ backgroundColor: item.color }}
                  className="w-24 h-24 rounded-full opacity-25 blur-3xl absolute"
                />
                <span className="text-xs font-mono font-bold" style={{ color: d.badgeText }}>
                  {item.category}
                </span>
              </div>

              <div>
                <div
                  style={{ color: c.accent }}
                  className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{item.metric}</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <span style={{ color: c.primary }} className="text-xs font-bold flex items-center gap-1">
                  Read Case Study <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section
        style={{
          backgroundColor: d.subtleBg,
          borderTop: `1px solid ${d.cardBorder}`,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="px-6 py-16"
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Full-Spectrum Capabilities</h2>
            <p style={{ color: d.mutedText }} className="text-xs">From zero-to-one identity to enterprise code delivery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Brand Architecture', desc: 'Naming, positioning, visual identity systems, and custom typographic guidelines.', icon: Sparkles },
              { title: 'Digital Product Design', desc: 'Design systems, interaction design, micro-animations, and conversion-optimized funnels.', icon: Layers },
              { title: 'Next-Gen Engineering', desc: 'High-performance React/Next.js platforms, WebGL spatial canvases, and automated CI pipelines.', icon: Zap },
            ].map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: c.surface,
                    borderColor: d.cardBorder,
                    borderRadius: r,
                  }}
                  className="p-6 border shadow-sm"
                >
                  <div
                    style={{ backgroundColor: d.badgeBg, color: c.primary, borderRadius: r }}
                    className="w-10 h-10 flex items-center justify-center font-bold mb-4"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold mb-2">{srv.title}</h3>
                  <p style={{ color: d.mutedText }} className="text-xs leading-relaxed">{srv.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* High-Impact CTA Banner */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full text-center">
        <div
          style={{
            backgroundColor: c.surface,
            borderColor: c.primary,
            borderRadius: r,
            boxShadow: `0 20px 60px ${d.primaryGlowRgba}`,
          }}
          className="border-2 p-10 sm:p-14"
        >
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Ready to Build Something Extraordinary?
          </h2>
          <p style={{ color: d.mutedText }} className="text-sm max-w-lg mx-auto mb-8">
            We are currently reserving client sprints for Q3. Tell us about your roadmap.
          </p>
          <button
            style={{
              backgroundColor: c.primary,
              borderRadius: r,
            }}
            className="px-8 py-4 text-sm font-bold text-white shadow-xl hover:opacity-95 transition-all inline-flex items-center gap-2"
          >
            <span>Request Studio Proposal</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: `1px solid ${d.cardBorder}`,
          backgroundColor: c.surface,
        }}
        className="px-6 py-10 max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
      >
        <span className="font-bold">{system.websiteName} &copy; {new Date().getFullYear()}</span>
        <span style={{ color: d.mutedText }}>New York &middot; London &middot; Tokyo</span>
      </footer>
    </div>
  );
};
