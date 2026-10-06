import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  exportToCssVariables,
  exportToTailwindConfig,
  exportToJsonTokens,
  exportToW3cDesignTokens,
} from '../utils/colorUtils';
import { X, Copy, Check, Download, FileCode, Sliders } from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { exportModalOpen, setExportModalOpen, activeSystem, showToast } = useApp();
  const [selectedFormat, setSelectedFormat] = useState<'css' | 'tailwind' | 'json' | 'w3c'>('css');
  const [copied, setCopied] = useState(false);

  if (!exportModalOpen || !activeSystem) return null;

  let codeContent = '';
  let filename = '';
  let mimeType = 'text/plain';

  switch (selectedFormat) {
    case 'css':
      codeContent = exportToCssVariables(activeSystem);
      filename = `${activeSystem.websiteName.toLowerCase().replace(/\s+/g, '-')}-palette.css`;
      mimeType = 'text/css';
      break;
    case 'tailwind':
      codeContent = exportToTailwindConfig(activeSystem);
      filename = 'tailwind.config.js';
      mimeType = 'application/javascript';
      break;
    case 'json':
      codeContent = exportToJsonTokens(activeSystem);
      filename = `${activeSystem.websiteName.toLowerCase().replace(/\s+/g, '-')}-tokens.json`;
      mimeType = 'application/json';
      break;
    case 'w3c':
      codeContent = exportToW3cDesignTokens(activeSystem);
      filename = `${activeSystem.websiteName.toLowerCase().replace(/\s+/g, '-')}-w3c-tokens.json`;
      mimeType = 'application/json';
      break;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    showToast('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([codeContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  };

  const handleCopyAllHex = () => {
    const p = activeSystem.activeTheme === 'dark' ? activeSystem.darkPalette : activeSystem.lightPalette;
    const allHex = Object.entries(p)
      .map(([k, v]) => `${k}: ${v.hex} (${v.name})`)
      .join('\n');
    navigator.clipboard.writeText(allHex);
    showToast('All color hex codes copied');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <FileCode className="h-4 w-4 text-indigo-400" />
              Export Design System Tokens
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Production-ready formats for {activeSystem.websiteName} ({activeSystem.activeTheme} mode tokens included)
            </p>
          </div>
          <button
            onClick={() => setExportModalOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-slate-800">
          <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-lg border border-slate-800/80">
            <button
              onClick={() => setSelectedFormat('css')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedFormat === 'css'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CSS Variables
            </button>
            <button
              onClick={() => setSelectedFormat('tailwind')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedFormat === 'tailwind'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tailwind Config
            </button>
            <button
              onClick={() => setSelectedFormat('json')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedFormat === 'json'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              JSON Tokens
            </button>
            <button
              onClick={() => setSelectedFormat('w3c')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedFormat === 'w3c'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              W3C Tokens
            </button>
          </div>

          <button
            onClick={handleCopyAllHex}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium py-1 px-2 rounded hover:bg-slate-800/60 transition-colors"
          >
            Copy Raw Hex List
          </button>
        </div>

        {/* Code Content */}
        <div className="relative flex-1 my-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/90 font-mono text-xs">
          <pre className="p-4 overflow-auto h-[380px] text-slate-300 leading-relaxed tabular-nums">
            {codeContent}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <span className="text-xs text-slate-500 font-mono">Format: {filename}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              Download File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
