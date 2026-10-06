import React, { useState } from 'react';
import { GeneratedLayoutSystem } from '../../../types/colorforge';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap,
  Shield,
  Layers,
  Star,
  Users,
  Check,
} from 'lucide-react';

interface PreviewProps {
  system: GeneratedLayoutSystem;
  fontFamily: string;
}

export const LandingPagePreview: React.FC<PreviewProps> = ({ system, fontFamily }) => {
  const [activeTab, setActiveTab] = useState<'speed' | 'scale' | 'compliance'>('speed');
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
      {/* Top Bar */}
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
            className="w-8 h-8 flex items-center justify-center text-white"
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <span>{system.websiteName}</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold" style={{ color: d.mutedText }}>
          <span style={{ color: c.text }} className="cursor-pointer">Why Us</span>
          <span className="cursor-pointer">Comparison</span>
          <span className="cursor-pointer">Customers</span>
          <span className="cursor-pointer">Pricing</span>
        </nav>

        <button
          style={{
            backgroundColor: c.primary,
            borderRadius: r,
          }}
          className="px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
        >
          <span>Claim Free Trial</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-16 max-w-5xl mx-auto w-full text-center">
        <div
          style={{
            backgroundColor: d.badgeBg,
            color: d.badgeText,
            borderColor: d.cardBorder,
          }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold mb-6"
        >
          <Zap className="h-3.5 w-3.5" style={{ color: c.accent }} />
          <span>Over 25,000+ Teams Switched This Quarter</span>
        </div>

        <h1 className="text-4xl sm:text-7xl font-black tracking-tight leading-[1.08] mb-6 max-w-4xl mx-auto">
          Double Your Product Velocity <br />
          <span style={{ color: c.primary }}>Without Hiring More Engineers.</span>
        </h1>

        <p style={{ color: d.mutedText }} className="text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          The single source of truth for unified design systems, automated code generation, and provably compliant UI tokens.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            style={{
              backgroundColor: c.primary,
              borderRadius: r,
              boxShadow: `0 8px 30px ${d.primaryGlowRgba}`,
            }}
            className="px-8 py-4 text-sm font-bold text-white shadow-xl hover:opacity-95 transition-all flex items-center gap-2"
          >
            <span>Start Free 14-Day Trial</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            style={{
              backgroundColor: c.surface,
              borderColor: d.cardBorder,
              borderRadius: r,
            }}
            className="px-8 py-4 text-sm font-semibold border hover:opacity-80 transition-all"
          >
            View Customer Stories
          </button>
        </div>

        {/* Feature Tabs Card */}
        <div
          style={{
            backgroundColor: c.surface,
            borderColor: d.cardBorder,
            borderRadius: r,
          }}
          className="border p-6 shadow-xl text-left"
        >
          <div className="flex items-center gap-3 pb-4 mb-6 border-b" style={{ borderColor: d.cardBorder }}>
            {[
              { id: 'speed', label: '10x Faster Build Speeds' },
              { id: 'scale', label: 'Enterprise Token Scaling' },
              { id: 'compliance', label: 'Guaranteed WCAG AAA' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  backgroundColor: activeTab === tab.id ? c.primary : 'transparent',
                  color: activeTab === tab.id ? '#FFFFFF' : d.mutedText,
                  borderRadius: r,
                }}
                className="px-4 py-2 text-xs font-bold transition-all"
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Automated Code Generation on Every Commit</h3>
              <p style={{ color: d.mutedText }} className="text-xs leading-relaxed mb-4">
                No more hand-tweaking hex codes across disparate CSS files. Push your brand tokens once and synchronize Tailwind, React, and CSS Variables in seconds.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" style={{ color: c.primary }} /> <span>Zero runtime overhead or bundle bloat</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" style={{ color: c.primary }} /> <span>Full TypeScript typed color scales</span></div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: d.subtleBg,
                borderRadius: r,
                border: `1px solid ${d.cardBorder}`,
              }}
              className="p-6 h-48 flex items-center justify-center font-mono text-xs"
            >
              <div className="space-y-1 text-left w-full">
                <div style={{ color: c.accent }}>// colorforge.config.ts</div>
                <div>export const brandTheme = {'{'}</div>
                <div className="pl-4" style={{ color: c.primary }}>primary: '{c.primary}',</div>
                <div className="pl-4" style={{ color: c.secondary }}>secondary: '{c.secondary}',</div>
                <div className="pl-4" style={{ color: c.accent }}>accent: '{c.accent}'</div>
                <div>{'}'};</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Matrix: Us vs Others */}
      <section
        style={{
          backgroundColor: d.subtleBg,
          borderTop: `1px solid ${d.cardBorder}`,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="px-6 py-16"
      >
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Why Modern Teams Choose Us</h2>
            <p style={{ color: d.mutedText }} className="text-xs">Compare features with generic templates and legacy palette pickers</p>
          </div>

          <div
            style={{
              backgroundColor: c.surface,
              borderColor: d.cardBorder,
              borderRadius: r,
            }}
            className="border shadow-lg overflow-hidden"
          >
            <table className="w-full text-xs text-left">
              <thead>
                <tr style={{ backgroundColor: d.subtleBg, borderColor: d.cardBorder }} className="border-b">
                  <th className="p-4 font-bold">Capabilities</th>
                  <th className="p-4 font-bold" style={{ color: c.primary }}>{system.websiteName}</th>
                  <th className="p-4 font-bold" style={{ color: d.mutedText }}>Generic Color Pickers</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: d.cardBorder }}>
                {[
                  { feature: 'Live Full Website Layout Generation (12 types)', us: true, them: false },
                  { feature: 'Mathematical WCAG AAA Contrast Derivations', us: true, them: false },
                  { feature: 'Instant Tailwind, React TSX & CSS Exports', us: true, them: false },
                  { feature: 'Strict Anti-Random Color Discipline', us: true, them: false },
                  { feature: 'Dynamic 50-950 Tint & Shade Computation', us: true, them: true },
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-4 font-semibold">{row.feature}</td>
                    <td className="p-4 font-bold" style={{ color: c.primary }}>
                      <CheckCircle2 className="h-4 w-4" />
                    </td>
                    <td className="p-4">
                      {row.them ? <Check className="h-4 w-4" style={{ color: d.mutedText }} /> : <XCircle className="h-4 w-4 text-slate-500" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: `1px solid ${d.cardBorder}`,
          backgroundColor: c.surface,
        }}
        className="px-6 py-8 text-center text-xs"
      >
        <p style={{ color: d.mutedText }}>
          &copy; {new Date().getFullYear()} {system.websiteName}. Generated with ColorForge AI.
        </p>
      </footer>
    </div>
  );
};
