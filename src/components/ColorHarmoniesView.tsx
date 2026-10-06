import React, { useState } from 'react';
import { ColorHarmonyGroup } from '../types/colorforge';
import { useApp } from '../context/AppContext';
import { Copy, Check } from 'lucide-react';

interface ColorHarmoniesViewProps {
  harmonies: ColorHarmonyGroup[];
}

export const ColorHarmoniesView: React.FC<ColorHarmoniesViewProps> = ({ harmonies }) => {
  const { showToast } = useApp();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string, name: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copied ${name}: ${hex}`);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-6">
      <div>
        <h3 className="text-base font-bold text-white">
          Color Theory Harmonies
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Mathematical chromatic relationships calculated from your primary brand anchor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {harmonies.map((harmony, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 flex flex-col justify-between"
          >
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {harmony.type}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {harmony.description}
              </p>
            </div>

            {/* Harmony Color Strips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {harmony.colors.map((c, cIdx) => (
                <button
                  key={cIdx}
                  onClick={() => handleCopy(c.hex, c.name)}
                  className="group flex flex-col rounded-lg border border-slate-800 overflow-hidden text-left hover:border-slate-700 transition-colors focus:outline-none"
                >
                  <div
                    className="h-12 w-full p-1.5 flex items-start justify-end"
                    style={{ backgroundColor: c.hex }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 p-0.5 rounded bg-black/40 text-white transition-opacity">
                      {copiedHex === c.hex ? <Check className="h-2.5 w-2.5" /> : <Copy className="h-2.5 w-2.5" />}
                    </div>
                  </div>
                  <div className="p-1.5 bg-slate-900">
                    <span className="block font-mono text-[10px] font-semibold text-slate-200">
                      {c.hex}
                    </span>
                    <span className="block text-[9px] text-slate-400 truncate">
                      {c.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
