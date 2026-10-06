import React, { useState } from 'react';
import { GeneratedLayoutSystem } from '../../../types/colorforge';
import {
  ArrowUpRight,
  Sparkles,
  Code2,
  Palette,
  Terminal,
  Send,
  Mail,
  MapPin,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface PreviewProps {
  system: GeneratedLayoutSystem;
  fontFamily: string;
}

export const PortfolioPreview: React.FC<PreviewProps> = ({ system, fontFamily }) => {
  const [filter, setFilter] = useState<'all' | 'design' | 'engineering'>('all');
  const [messageSent, setMessageSent] = useState(false);

  const c = system.colors;
  const d = system.analysis.derivedColors;
  const r = system.borderRadius;

  const projects = [
    {
      title: 'Aura Spatial Audio Engine',
      category: 'engineering',
      desc: 'Real-time WebAudio spatializer and hardware DSP interface built with WebAssembly and WebGL canvas.',
      tag: 'WebGL / WebAudio',
      year: '2026',
    },
    {
      title: 'Kroma Design System',
      category: 'design',
      desc: 'Multi-brand design system encompassing 140+ accessible primitives and token automation pipelines.',
      tag: 'Design System / Token Architecture',
      year: '2025',
    },
    {
      title: 'Vanguard Terminal',
      category: 'engineering',
      desc: 'High-throughput institutional cryptographic trading station with sub-millisecond websocket ingestion.',
      tag: 'TypeScript / Canvas',
      year: '2025',
    },
    {
      title: 'Lumina Brand Identity',
      category: 'design',
      desc: 'Complete identity, typographic system, and editorial collateral for a sustainable clean-tech lab.',
      tag: 'Identity / Creative Direction',
      year: '2024',
    },
  ];

  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.category === filter);

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
        <div className="flex items-center gap-3 font-bold text-sm">
          <div
            style={{ backgroundColor: c.primary, borderRadius: r }}
            className="w-8 h-8 flex items-center justify-center text-white text-xs font-black shadow-sm"
          >
            {system.websiteName.charAt(0)}
          </div>
          <span className="tracking-tight">{system.websiteName}</span>
        </div>

        <nav className="hidden sm:flex items-center gap-6 text-xs font-medium" style={{ color: d.mutedText }}>
          <span className="hover:text-white cursor-pointer" style={{ color: c.text }}>Selected Work</span>
          <span className="hover:text-white cursor-pointer">About</span>
          <span className="hover:text-white cursor-pointer">Experience</span>
          <span className="hover:text-white cursor-pointer">Contact</span>
        </nav>

        <a
          href="#contact"
          style={{
            backgroundColor: c.primary,
            borderRadius: r,
          }}
          className="px-3.5 py-1.5 text-xs font-bold text-white hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span>Get in Touch</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-16 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-6">
          <div
            style={{
              backgroundColor: d.badgeBg,
              borderColor: d.cardBorder,
              color: d.badgeText,
            }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold"
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: c.accent }} />
            <span>Available for select engineering & design commissions</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-6 max-w-4xl">
          Crafting high-conviction digital products at the intersection of <span style={{ color: c.primary }}>code</span> and <span style={{ color: c.accent }}>design</span>.
        </h1>

        <p
          style={{ color: d.mutedText }}
          className="text-base sm:text-lg max-w-2xl leading-relaxed mb-8"
        >
          Senior Principal Designer & Systems Engineer. Previously lead architect at pioneering design studios. Specializing in design systems, WebGL rendering, and zero-compromise user interfaces.
        </p>

        {/* Skills Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
          {['Design Systems', 'TypeScript', 'React 19', 'WCAG AAA', 'Tailwind CSS', 'WebGL', 'Figma Tokens'].map(skill => (
            <span
              key={skill}
              style={{
                backgroundColor: d.subtleBg,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="px-3 py-1.5 text-xs font-semibold border"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Selected Work Showcase */}
      <section className="px-6 py-12 max-w-5xl mx-auto w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Selected Projects</h2>
            <p style={{ color: d.mutedText }} className="text-xs">Engineering prototypes and live production cases</p>
          </div>

          <div
            style={{
              backgroundColor: c.surface,
              borderColor: d.cardBorder,
              borderRadius: r,
            }}
            className="inline-flex p-1 border text-xs font-medium"
          >
            {(['all', 'design', 'engineering'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  backgroundColor: filter === tab ? c.primary : 'transparent',
                  color: filter === tab ? '#FFFFFF' : d.mutedText,
                  borderRadius: r,
                }}
                className="px-3 py-1 capitalize transition-all"
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((proj, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: c.surface,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="border p-6 flex flex-col justify-between group hover:border-indigo-500/50 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    style={{
                      backgroundColor: d.badgeBg,
                      color: d.badgeText,
                    }}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold"
                  >
                    {proj.tag}
                  </span>
                  <span style={{ color: d.mutedText }} className="text-xs font-mono">{proj.year}</span>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                  <span>{proj.title}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                </h3>

                <p style={{ color: d.mutedText }} className="text-xs leading-relaxed mb-6">
                  {proj.desc}
                </p>
              </div>

              {/* Preview canvas bar */}
              <div
                style={{
                  backgroundColor: d.subtleBg,
                  borderRadius: r,
                  border: `1px solid ${d.cardBorder}`,
                }}
                className="h-28 w-full flex items-center justify-center p-4 relative overflow-hidden"
              >
                <div
                  style={{
                    backgroundColor: idx % 2 === 0 ? c.primary : c.secondary,
                    borderRadius: r,
                  }}
                  className="w-16 h-16 opacity-30 blur-2xl absolute"
                />
                <span className="text-[11px] font-mono font-semibold relative z-10" style={{ color: d.mutedText }}>
                  Live Case Study Preview &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Timeline */}
      <section
        style={{
          backgroundColor: d.subtleBg,
          borderTop: `1px solid ${d.cardBorder}`,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="px-6 py-16"
      >
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Career Timeline</h2>
          <div className="space-y-6">
            {[
              { role: 'Staff Systems Architect', company: 'Apex Design Labs', period: '2023 — Present', desc: 'Leading design engineering and token sync pipelines for distributed enterprise platforms.' },
              { role: 'Lead UI/UX Engineer', company: 'Hyperion Interactive', period: '2021 — 2023', desc: 'Engineered high-performance data visualizations and design systems used by over 3M weekly active users.' },
              { role: 'Frontend Engineer', company: 'Monolith Studio', period: '2019 — 2021', desc: 'Crafted award-winning Awwwards Site of the Day interactive WebGL agency platforms.' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: c.surface,
                  borderColor: d.cardBorder,
                  borderRadius: r,
                }}
                className="p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-sm font-bold">{item.role}</h3>
                  <div className="text-xs font-semibold" style={{ color: c.primary }}>{item.company}</div>
                  <p style={{ color: d.mutedText }} className="text-xs mt-1">{item.desc}</p>
                </div>
                <div className="text-xs font-mono shrink-0" style={{ color: d.mutedText }}>{item.period}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Contact Form */}
      <section id="contact" className="px-6 py-16 max-w-3xl mx-auto w-full">
        <div
          style={{
            backgroundColor: c.surface,
            borderColor: d.cardBorder,
            borderRadius: r,
          }}
          className="border p-8 shadow-xl"
        >
          <div className="text-center max-w-md mx-auto mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Let’s Start a Conversation</h2>
            <p style={{ color: d.mutedText }} className="text-xs">
              Have an ambitious project in mind? Reach out and I’ll respond within 24 hours.
            </p>
          </div>

          {messageSent ? (
            <div
              style={{
                backgroundColor: d.badgeBg,
                color: d.badgeText,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="p-6 border text-center space-y-2"
            >
              <CheckCircle2 className="h-8 w-8 mx-auto" style={{ color: c.primary }} />
              <div className="text-sm font-bold">Message Dispatched!</div>
              <p className="text-xs">Thank you for reaching out. I'll get back to you shortly.</p>
            </div>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                setMessageSent(true);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold mb-1" style={{ color: d.mutedText }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jordan Lee"
                    style={{
                      backgroundColor: d.inputBg,
                      borderColor: d.inputBorder,
                      color: c.text,
                      borderRadius: r,
                    }}
                    className="w-full px-3.5 py-2 text-xs border focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1" style={{ color: d.mutedText }}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jordan@company.com"
                    style={{
                      backgroundColor: d.inputBg,
                      borderColor: d.inputBorder,
                      color: c.text,
                      borderRadius: r,
                    }}
                    className="w-full px-3.5 py-2 text-xs border focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1" style={{ color: d.mutedText }}>
                  Project Overview
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell me about your product timeline, goals, and scope..."
                  style={{
                    backgroundColor: d.inputBg,
                    borderColor: d.inputBorder,
                    color: c.text,
                    borderRadius: r,
                  }}
                  className="w-full px-3.5 py-2 text-xs border focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: c.primary,
                  borderRadius: r,
                }}
                className="w-full py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Transmit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: `1px solid ${d.cardBorder}`,
          backgroundColor: d.subtleBg,
        }}
        className="px-6 py-8 text-center text-xs"
      >
        <p style={{ color: d.mutedText }}>
          &copy; {new Date().getFullYear()} {system.websiteName}. Crafted with ColorForge AI.
        </p>
      </footer>
    </div>
  );
};
