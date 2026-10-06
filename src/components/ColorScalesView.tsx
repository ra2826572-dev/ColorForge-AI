import React, { useState } from 'react';
import { ColorScaleShade } from '../types/colorforge';
import { useApp } from '../context/AppContext';
import { Check, Copy } from 'lucide-react';

interface ColorScalesViewProps {
  scales: {
    primary: ColorScaleShade[];
    secondary: ColorScaleShade[];
    accent: ColorScaleShade[];
  };
}

export const ColorScalesView: React.FC<ColorScalesViewProps> = ({ scales }) => {
  const { showToast } = useApp();
  const [activeScaleTab, setActiveScaleTab] = useState<'primary' | 'secondary' | 'accent'>('primary');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const currentList = scales[activeScaleTab];

  const handleCopy = (hex: string, step: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copied ${activeScaleTab} ${step}: ${hex}`);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white">
            11-Step Tonal Scale (50 — 950)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Calibrated lightness ramps tailored for Tailwind CSS and design token architectures.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {(['primary', 'secondary', 'accent'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveScaleTab(tab)}
              className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-colors ${
                activeScaleTab === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab} Scale
            </button>
          ))}
        </div>
      </div>

      {/* Visual Color Scale Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-2.5">
        {currentList.map(shade => {
          const isCopied = copiedHex === shade.hex;
          // Determine if text should be white or black based on step
          const stepNum = parseInt(shade.step);
          const isDarkShade = stepNum >= 500;

          return (
            <button
              key={shade.step}
              onClick={() => handleCopy(shade.hex, shade.step)}
              className="group relative flex flex-col rounded-xl overflow-hidden border border-slate-800 text-left transition-all hover:scale-[1.03] hover:z-10 focus:outline-none"
            >
              <div
                className="h-20 w-full relative p-2 flex items-start justify-between transition-colors"
                style={{ backgroundColor: shade.hex }}
              >
                <span
                  className={`text-[10px] font-mono font-bold ${
                    isDarkShade ? 'text-white/90' : 'text-slate-900'
                  }`}
                >
                  {shade.step}
                </span>

                <div
                  className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                    isDarkShade ? 'bg-black/30 text-white' : 'bg-white/40 text-black'
                  }`}
                >
                  {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </div>
              </div>

              <div className="p-2 bg-slate-950 border-t border-slate-800/80">
                <span className="block font-mono text-[11px] font-semibold text-slate-200">
                  {shade.hex}
                </span>
                <span className="block font-mono text-[10px] text-slate-500 truncate">
                  {shade.hsl}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
