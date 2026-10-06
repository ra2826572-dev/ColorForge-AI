import React, { useState } from 'react';
import { GeneratedLayoutSystem } from '../../../types/colorforge';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  TrendingUp,
  Percent,
  Zap,
  Globe,
  CheckCircle,
} from 'lucide-react';

interface PreviewProps {
  system: GeneratedLayoutSystem;
  fontFamily: string;
}

export const FinancePreview: React.FC<PreviewProps> = ({ system, fontFamily }) => {
  const [depositAmount, setDepositAmount] = useState(25000);
  const c = system.colors;
  const d = system.analysis.derivedColors;
  const r = system.borderRadius;

  const annualYield = (depositAmount * 0.0515).toFixed(2);

  return (
    <div
      style={{
        backgroundColor: c.background,
        color: c.text,
        fontFamily,
      }}
      className="w-full flex flex-col transition-colors duration-200"
    >
      {/* Top Compliance Bar */}
      <div
        style={{
          backgroundColor: d.subtleBg,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="px-6 py-2 text-xs flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: c.accent }} />
          <span>Member FDIC &middot; Deposits Insured Up to $2,500,000 via Sweep Network</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px]" style={{ color: d.mutedText }}>
          <span>Institutional Wealth</span>
          <span>Treasury APIs</span>
          <span>Security Protocol</span>
        </div>
      </div>

      {/* Main Header */}
      <header
        style={{
          backgroundColor: c.surface,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3 font-bold text-lg">
          <div
            style={{ backgroundColor: c.primary, borderRadius: r }}
            className="w-8 h-8 flex items-center justify-center text-white text-xs font-black shadow-md"
          >
            {system.websiteName.charAt(0)}
          </div>
          <span>{system.websiteName}</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold" style={{ color: d.mutedText }}>
          <span style={{ color: c.text }} className="cursor-pointer">High-Yield Cash</span>
          <span className="cursor-pointer">Global Transfers</span>
          <span className="cursor-pointer">Corporate Cards</span>
          <span className="cursor-pointer">Yield Accounts</span>
        </nav>

        <div className="flex items-center gap-3">
          <button className="text-xs font-semibold px-3 py-1.5 hover:opacity-80">Sign In</button>
          <button
            style={{
              backgroundColor: c.primary,
              borderRadius: r,
            }}
            className="px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <span>Open Account</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-14 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div
            style={{
              backgroundColor: d.badgeBg,
              color: d.badgeText,
              borderColor: d.cardBorder,
            }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-6"
          >
            <Percent className="h-3.5 w-3.5" style={{ color: c.accent }} />
            <span>5.15% APY High-Yield Cash Account &middot; Zero Lock-In</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            Institutional Yield. <br />
            <span style={{ color: c.primary }}>Zero Modern Friction.</span>
          </h1>

          <p style={{ color: d.mutedText }} className="text-sm sm:text-base leading-relaxed mb-8">
            Experience next-generation treasury management. Automatically sweep idle liquidity into government-backed securities while maintaining instant same-day wires.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              style={{
                backgroundColor: c.primary,
                borderRadius: r,
              }}
              className="px-6 py-3.5 text-xs font-bold text-white shadow-xl hover:opacity-90 transition-all flex items-center gap-2"
            >
              <span>Get Started in 3 Minutes</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: d.mutedText }}>
              <Lock className="h-4 w-4" style={{ color: c.accent }} />
              <span>256-bit AES cryptographic custody</span>
            </div>
          </div>
        </div>

        {/* Dynamic Card Display using user's colors */}
        <div className="flex justify-center">
          <div
            style={{
              background: `linear-gradient(135deg, ${c.primary} 0%, ${c.secondary} 60%, ${c.surface} 100%)`,
              borderRadius: '16px',
              border: `1px solid ${d.cardBorder}`,
              boxShadow: `0 25px 60px ${d.shadowRgba}`,
            }}
            className="w-full max-w-sm h-56 p-6 text-white flex flex-col justify-between relative overflow-hidden transition-transform hover:scale-105 duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest uppercase font-bold opacity-80">{system.websiteName} Obsidian</span>
              <div
                style={{ backgroundColor: c.accent, color: c.background }}
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
              >
                ⁑
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-7 bg-amber-400/80 rounded-md border border-amber-300/40" />
              <span className="font-mono text-xs opacity-70">Wireless Pay</span>
            </div>

            <div>
              <div className="font-mono text-base tracking-widest mb-1">•••• •••• •••• 9821</div>
              <div className="flex items-center justify-between text-[11px] font-mono opacity-80">
                <span>ALEX VANCE</span>
                <span>EXP 09/29</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Yield Calculator */}
      <section
        style={{
          backgroundColor: d.subtleBg,
          borderTop: `1px solid ${d.cardBorder}`,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="px-6 py-16"
      >
        <div className="max-w-4xl mx-auto w-full">
          <div
            style={{
              backgroundColor: c.surface,
              borderColor: d.cardBorder,
              borderRadius: r,
            }}
            className="p-8 border shadow-lg"
          >
            <div className="text-center max-w-lg mx-auto mb-8">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Simulate Your Annual Return</h2>
              <p style={{ color: d.mutedText }} className="text-xs">Based on current 5.15% APY government treasury sweep returns</p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Initial Cash Deposit</span>
                  <span className="font-mono text-base" style={{ color: c.primary }}>${depositAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="500000"
                  step="5000"
                  value={depositAmount}
                  onChange={e => setDepositAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div
                style={{
                  backgroundColor: d.subtleBg,
                  borderColor: d.cardBorder,
                  borderRadius: r,
                }}
                className="p-4 border flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div>
                  <span className="text-xs block" style={{ color: d.mutedText }}>Estimated Annual Passive Yield</span>
                  <span className="text-3xl font-black" style={{ color: c.accent }}>+${Number(annualYield).toLocaleString()} / year</span>
                </div>
                <button
                  style={{
                    backgroundColor: c.primary,
                    borderRadius: r,
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all shrink-0"
                >
                  Lock In This Rate &rarr;
                </button>
              </div>
            </div>
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
        <p style={{ color: d.mutedText }} className="max-w-2xl mx-auto">
          &copy; {new Date().getFullYear()} {system.websiteName} Financial Technologies Inc. Banking services provided by Evolve Bank & Trust, Member FDIC. All investments involve risk.
        </p>
      </footer>
    </div>
  );
};
