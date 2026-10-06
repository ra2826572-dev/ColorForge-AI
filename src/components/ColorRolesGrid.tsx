import React, { useState } from 'react';
import { ColorRole, PaletteTheme } from '../types/colorforge';
import { Copy, Check, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ColorRolesGridProps {
  palette: PaletteTheme;
  themeMode: 'light' | 'dark';
}

export const ColorRolesGrid: React.FC<ColorRolesGridProps> = ({ palette, themeMode }) => {
  const { showToast } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyVal = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(`${label}-${text}`);
    showToast(`Copied ${label}: ${text}`);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const roles = [
    { key: 'primary', label: 'Primary Brand', role: palette.primary, category: 'Brand Foundation' },
    { key: 'secondary', label: 'Secondary Tone', role: palette.secondary, category: 'Brand Foundation' },
    { key: 'accent', label: 'Accent Highlight', role: palette.accent, category: 'Brand Foundation' },
    { key: 'background', label: 'Canvas Background', role: palette.background, category: 'Surfaces' },
    { key: 'surface', label: 'Surface Container', role: palette.surface, category: 'Surfaces' },
    { key: 'card', label: 'Card Elevation', role: palette.card, category: 'Surfaces' },
    { key: 'border', label: 'Hairline Border', role: palette.border, category: 'Surfaces' },
    { key: 'text', label: 'Display & Body Text', role: palette.text, category: 'Typography' },
    { key: 'mutedText', label: 'Muted Subtitle Text', role: palette.mutedText, category: 'Typography' },
    { key: 'button', label: 'Primary Button Solid', role: palette.button, category: 'Interactive' },
    { key: 'buttonHover', label: 'Button Hover State', role: palette.buttonHover, category: 'Interactive' },
    { key: 'buttonText', label: 'Button Typography', role: palette.buttonText, category: 'Interactive' },
    { key: 'link', label: 'Hyperlink Color', role: palette.link, category: 'Interactive' },
    { key: 'linkHover', label: 'Hyperlink Hover', role: palette.linkHover, category: 'Interactive' },
    { key: 'success', label: 'Success Positive', role: palette.success, category: 'Semantic Status' },
    { key: 'warning', label: 'Warning Caution', role: palette.warning, category: 'Semantic Status' },
    { key: 'error', label: 'Error Critical', role: palette.error, category: 'Semantic Status' },
    { key: 'info', label: 'Informational Notice', role: palette.info, category: 'Semantic Status' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(({ key, label, role, category }) => (
          <div
            key={key}
            className="group rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden hover:border-slate-700 transition-all shadow-sm"
          >
            {/* Color Swatch Header with Live Preview Chip */}
            <div
              className="h-24 w-full relative p-3 flex flex-col justify-between transition-transform duration-300"
              style={{ backgroundColor: role.hex }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-md bg-black/40 text-white/90">
                  {category}
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded backdrop-blur-md bg-black/40 text-white/95">
                  {role.hex}
                </span>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{label}</h4>
                  <span className="text-[11px] font-medium text-slate-400 truncate max-w-[140px] text-right">
                    {role.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  <strong className="text-slate-300">Used for: </strong>
                  {role.usage}
                </p>
              </div>

              {/* Color Values & Copy Buttons */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-slate-400">HEX</span>
                  <button
                    onClick={() => copyVal(role.hex, 'HEX')}
                    className="flex items-center gap-1 text-slate-200 hover:text-indigo-400 transition-colors"
                  >
                    <span>{role.hex}</span>
                    {copiedKey === `HEX-${role.hex}` ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-slate-400 group-hover:text-slate-200" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between py-0.5">
                  <span className="text-slate-400">RGB</span>
                  <button
                    onClick={() => copyVal(role.rgb, 'RGB')}
                    className="flex items-center gap-1 text-slate-200 hover:text-indigo-400 transition-colors"
                  >
                    <span>{role.rgb}</span>
                    {copiedKey === `RGB-${role.rgb}` ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-slate-400 group-hover:text-slate-200" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between py-0.5">
                  <span className="text-slate-400">HSL</span>
                  <button
                    onClick={() => copyVal(role.hsl, 'HSL')}
                    className="flex items-center gap-1 text-slate-200 hover:text-indigo-400 transition-colors"
                  >
                    <span>{role.hsl}</span>
                    {copiedKey === `HSL-${role.hsl}` ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-slate-400 group-hover:text-slate-200" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
