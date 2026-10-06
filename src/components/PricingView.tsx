import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, Sparkles, Shield, Zap, CreditCard, ArrowRight } from 'lucide-react';

export const PricingView: React.FC = () => {
  const { user, upgradePlan, showToast } = useApp();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSimulateUpgrade = async () => {
    setProcessing(true);
    setTimeout(async () => {
      await upgradePlan('pro');
      setProcessing(false);
      setShowCheckoutModal(false);
    }, 1200);
  };

  const isPro = user?.plan === 'pro';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Subscription & Limits</span>
        <h1 className="text-3xl font-extrabold text-white">
          Transparent, Value-Focused Pricing
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          From solo developers building personal portfolios to creative agencies designing enterprise SaaS brand systems.
        </p>

        {/* Current Quota Indicator */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1.5 text-xs text-slate-300 mt-2">
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          <span>
            Current Status:{' '}
            <strong className="text-white">
              {isPro ? 'Pro Active (Unlimited)' : `${user?.generationsUsed || 0} / 5 Generations Used`}
            </strong>
          </span>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs ${billingPeriod === 'monthly' ? 'text-white font-semibold' : 'text-slate-400'}`}>Monthly</span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="relative h-6 w-11 rounded-full bg-slate-800 p-0.5 transition-colors"
          >
            <div
              className={`h-5 w-5 rounded-full bg-indigo-500 transition-transform ${
                billingPeriod === 'yearly' ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs flex items-center gap-1.5 ${billingPeriod === 'yearly' ? 'text-white font-semibold' : 'text-slate-400'}`}>
            <span>Yearly</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.2 rounded">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-7 flex flex-col justify-between space-y-6 shadow-lg">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Starter Tier</span>
              <h3 className="text-xl font-bold text-white mt-1">Free Tier</h3>
              <p className="text-xs text-slate-400 mt-1">Ideal for evaluating palettes and initial exploration.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white font-mono">$0</span>
              <span className="text-xs text-slate-500">/ forever</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>5 AI palette generations per month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Basic website preview</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Save up to 5 projects in workspace</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Standard CSS variables export</span>
              </li>
            </ul>
          </div>

          <button
            disabled={!isPro}
            onClick={() => upgradePlan('free')}
            className={`w-full rounded-xl py-2.5 text-xs font-semibold border transition-colors ${
              !isPro
                ? 'border-slate-700 bg-slate-800/40 text-slate-400 cursor-default'
                : 'border-slate-700 text-slate-200 hover:bg-slate-800'
            }`}
          >
            {!isPro ? 'Current Plan' : 'Downgrade to Free'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="relative rounded-2xl border-2 border-indigo-500/80 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/30 p-7 flex flex-col justify-between space-y-6 shadow-2xl">
          <div className="absolute -top-3 right-6 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-md">
            Recommended
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Professional Studio</span>
              <h3 className="text-xl font-bold text-white mt-1">Pro Plan</h3>
              <p className="text-xs text-slate-400 mt-1">Full power for designers, builders, and high-velocity agencies.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white font-mono">
                {billingPeriod === 'monthly' ? '$29' : '$23'}
              </span>
              <span className="text-xs text-slate-500">
                / month {billingPeriod === 'yearly' && '(billed annually)'}
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                <span className="font-semibold text-white">Unlimited AI generations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Natural-language AI iterative refinement</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Full WCAG AAA/AA automated contrast auditor</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Tailwind CSS, JSON, and W3C token exports</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>11-step complete tonal scale generator (50–950)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Light & Dark synchronized dual-mode palettes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Unlimited project saving and history archive</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              if (isPro) {
                showToast('You are already on the Pro Plan');
              } else {
                setShowCheckoutModal(true);
              }
            }}
            className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isPro ? 'Pro Active' : 'Upgrade to Pro'}
          </button>
        </div>
      </div>

      {/* Stripe-Ready Simulation Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div>
              <span className="text-xs font-mono uppercase text-indigo-400">Instant Activation</span>
              <h3 className="text-lg font-bold text-white mt-1">Upgrade to ColorForge Pro</h3>
              <p className="text-xs text-slate-400 mt-1">
                Unlock unlimited AI generations, full token exports, and iterative chat refinement.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>ColorForge Pro ({billingPeriod})</span>
                <span className="font-mono font-bold text-white">{billingPeriod === 'monthly' ? '$29.00' : '$276.00'}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Tax</span>
                <span className="font-mono">$0.00</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between text-xs font-bold text-white">
                <span>Total Due</span>
                <span className="font-mono text-indigo-400">{billingPeriod === 'monthly' ? '$29.00' : '$276.00'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-300">Demo Card Payment</label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-400 font-mono">
                <CreditCard className="h-4 w-4 text-slate-500 shrink-0" />
                <span>•••• •••• •••• 4242 (Stripe Test Simulator)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 rounded-xl border border-slate-800 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={processing}
                onClick={handleSimulateUpgrade}
                className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
              >
                {processing ? 'Activating...' : 'Confirm Upgrade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
