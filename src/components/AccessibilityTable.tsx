import React from 'react';
import { AccessibilityCheck } from '../types/colorforge';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

interface AccessibilityTableProps {
  checks: AccessibilityCheck[];
}

export const AccessibilityTable: React.FC<AccessibilityTableProps> = ({ checks }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            WCAG Accessibility Compliance
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluated against Web Content Accessibility Guidelines (WCAG 2.1 AA/AAA) contrast metrics.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 font-semibold">AAA (7:1+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            <span className="text-blue-400 font-semibold">AA (4.5:1+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span className="text-rose-400 font-semibold">Fail (&lt;4.5:1)</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-medium">
              <th className="pb-3 pl-2">Element Pair</th>
              <th className="pb-3 px-3">Foreground</th>
              <th className="pb-3 px-3">Background</th>
              <th className="pb-3 px-3 text-right">Contrast Ratio</th>
              <th className="pb-3 px-4 text-center">WCAG Level</th>
              <th className="pb-3 pr-2">Actionable Guidance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {checks.map((item, index) => {
              const isAAA = item.rating === 'AAA';
              const isAA = item.rating === 'AA';
              const isFail = item.rating === 'Fail';

              return (
                <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 pl-2 font-medium text-slate-200">
                    {item.pair}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
                      <span
                        className="h-4 w-4 rounded border border-white/20 shrink-0"
                        style={{ backgroundColor: item.foreground }}
                      />
                      <span>{item.foreground}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
                      <span
                        className="h-4 w-4 rounded border border-white/20 shrink-0"
                        style={{ backgroundColor: item.background }}
                      />
                      <span>{item.background}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold tabular-nums text-slate-100">
                    {item.ratio}:1
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2.5 py-1 rounded-md ${
                        isAAA
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                          : isAA
                          ? 'bg-blue-950/60 text-blue-300 border border-blue-500/30'
                          : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {isAAA && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                      {isAA && <CheckCircle2 className="h-3 w-3 text-blue-400" />}
                      {isFail && <XCircle className="h-3 w-3 text-rose-400" />}
                      {item.rating}
                    </span>
                  </td>
                  <td className="py-3.5 pr-2 text-slate-400 text-[11px] max-w-xs">
                    {item.recommendation ? (
                      <span className="text-amber-300/90 flex items-start gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400 mt-0.5" />
                        {item.recommendation}
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        Excellent visual distinction. Fully compliant for normal and small text.
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
