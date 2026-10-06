import React, { useState } from 'react';
import { GeneratedLayoutSystem } from '../../types/colorforge';
import { exportLayoutHtml, exportLayoutReact } from '../../utils/layoutEngine';
import { X, Copy, Check, Download, Code, FileCode } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LayoutExportModalProps {
  system: GeneratedLayoutSystem;
  isOpen: boolean;
  onClose: () => void;
}

export const LayoutExportModal: React.FC<LayoutExportModalProps> = ({
  system,
  isOpen,
  onClose,
}) => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'html' | 'react' | 'tailwind' | 'css'>('html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlCode = exportLayoutHtml(system);
  const reactCode = exportLayoutReact(system);

  const tailwindSnippet = `// tailwind.config.js extension
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${system.colors.primary}',
        secondary: '${system.colors.secondary}',
        accent: '${system.colors.accent}',
        background: '${system.colors.background}',
        surface: '${system.colors.surface}',
        text: '${system.colors.text}',
        muted: '${system.analysis.derivedColors.mutedText}',
        border: '${system.analysis.derivedColors.cardBorder}',
      },
      borderRadius: {
        brand: '${system.borderRadius}',
      }
    }
  }
};`;

  const cssVariablesSnippet = `:root {
  --color-primary: ${system.colors.primary};
  --color-secondary: ${system.colors.secondary};
  --color-accent: ${system.colors.accent};
  --color-background: ${system.colors.background};
  --color-surface: ${system.colors.surface};
  --color-text: ${system.colors.text};
  --color-muted: ${system.analysis.derivedColors.mutedText};
  --color-border: ${system.analysis.derivedColors.cardBorder};
  --color-button-hover: ${system.analysis.derivedColors.buttonHover};
  --radius-brand: ${system.borderRadius};
}`;

  let currentCode = htmlCode;
  let fileExt = 'html';
  if (activeTab === 'react') {
    currentCode = reactCode;
    fileExt = 'tsx';
  } else if (activeTab === 'tailwind') {
    currentCode = tailwindSnippet;
    fileExt = 'js';
  } else if (activeTab === 'css') {
    currentCode = cssVariablesSnippet;
    fileExt = 'css';
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    showToast('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${system.websiteName.toLowerCase().replace(/\s+/g, '-')}-${system.websiteType.toLowerCase()}.${fileExt}`;
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Code className="h-5 w-5 text-indigo-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Export Website Layout Code</h2>
              <p className="text-[11px] text-slate-400">
                Production-ready code strictly anchored to your selected palette
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/50 px-6 py-2.5">
          <div className="flex items-center gap-2">
            {[
              { id: 'html', label: 'HTML + Tailwind' },
              { id: 'react', label: 'React TSX' },
              { id: 'tailwind', label: 'Tailwind Config' },
              { id: 'css', label: 'CSS Variables' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300">
          <pre className="whitespace-pre-wrap leading-relaxed select-all">{currentCode}</pre>
        </div>
      </div>
    </div>
  );
};
