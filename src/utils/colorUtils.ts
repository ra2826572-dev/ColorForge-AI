import { AccessibilityCheck, ColorHarmonyGroup, ColorRole, ColorScaleShade, ColorSystem, PaletteTheme } from '../types/colorforge';

// Convert HEX to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace(/^#/, '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0').toUpperCase();
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Convert HSL to HEX
export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// Calculate relative luminance for WCAG contrast
export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate WCAG Contrast Ratio
export function getContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const lum1 = getRelativeLuminance(foregroundHex);
  const lum2 = getRelativeLuminance(backgroundHex);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return Number(ratio.toFixed(2));
}

// Evaluate contrast status
export function evaluateContrast(ratio: number, isLargeText: boolean = false): 'AAA' | 'AA' | 'Fail' {
  if (isLargeText) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3.0) return 'AA';
    return 'Fail';
  }
  if (ratio >= 7.0) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'Fail';
}

// Generate color scale (50 - 950)
export function generateColorScale(baseHex: string): ColorScaleShade[] {
  const { r, g, b } = hexToRgb(baseHex);
  const { h, s } = rgbToHsl(r, g, b);

  const steps: { step: ColorScaleShade['step']; l: number }[] = [
    { step: '50', l: 96 },
    { step: '100', l: 91 },
    { step: '200', l: 83 },
    { step: '300', l: 72 },
    { step: '400', l: 60 },
    { step: '500', l: 49 },
    { step: '600', l: 40 },
    { step: '700', l: 32 },
    { step: '800', l: 23 },
    { step: '900', l: 15 },
    { step: '950', l: 9 },
  ];

  return steps.map(({ step, l }) => {
    // Keep saturation natural: slightly less saturated at extreme highlights/shadows
    const satAdjust = step === '50' || step === '950' ? Math.max(10, s * 0.75) : s;
    const hex = hslToHex(h, satAdjust, l);
    const rgb = hexToRgb(hex);
    return {
      step,
      hex,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${h}, ${Math.round(satAdjust)}%, ${l}%)`,
    };
  });
}

// Generate Color Harmonies
export function generateColorHarmonies(baseHex: string): ColorHarmonyGroup[] {
  const { r, g, b } = hexToRgb(baseHex);
  const { h, s, l } = rgbToHsl(r, g, b);

  return [
    {
      type: 'Complementary',
      description: 'Opposite on the color wheel; provides high contrast and energetic emphasis.',
      colors: [
        { name: 'Base', hex: baseHex, role: 'Base tone' },
        { name: 'Complement', hex: hslToHex(h + 180, s, l), role: 'Opposing accent' },
      ],
    },
    {
      type: 'Analogous',
      description: 'Adjacent colors on the wheel; creates serene and harmonious visual flow.',
      colors: [
        { name: 'Analogous -30°', hex: hslToHex(h - 30, s, l), role: 'Neighboring cool' },
        { name: 'Base', hex: baseHex, role: 'Base tone' },
        { name: 'Analogous +30°', hex: hslToHex(h + 30, s, l), role: 'Neighboring warm' },
      ],
    },
    {
      type: 'Triadic',
      description: 'Three evenly spaced colors (120° apart); vibrant yet balanced.',
      colors: [
        { name: 'Base', hex: baseHex, role: 'Primary anchor' },
        { name: 'Triad 1', hex: hslToHex(h + 120, s, l), role: 'Secondary energy' },
        { name: 'Triad 2', hex: hslToHex(h + 240, s, l), role: 'Supporting accent' },
      ],
    },
    {
      type: 'Split Complementary',
      description: 'The base color plus two colors adjacent to its complement; rich nuance with less tension.',
      colors: [
        { name: 'Base', hex: baseHex, role: 'Anchor' },
        { name: 'Split Left', hex: hslToHex(h + 150, s, l), role: 'Warm split' },
        { name: 'Split Right', hex: hslToHex(h + 210, s, l), role: 'Cool split' },
      ],
    },
    {
      type: 'Tetradic',
      description: 'Two complementary pairs (90° apart); dynamic range suitable for rich multi-card layouts.',
      colors: [
        { name: 'Base', hex: baseHex, role: 'Dominant' },
        { name: 'Shift +90°', hex: hslToHex(h + 90, s, l), role: 'Sub-dominant' },
        { name: 'Complement', hex: hslToHex(h + 180, s, l), role: 'Contrast' },
        { name: 'Shift +270°', hex: hslToHex(h + 270, s, l), role: 'Tertiary accent' },
      ],
    },
  ];
}

// Generate Accessibility Checks
export function generateAccessibilityChecks(palette: PaletteTheme): AccessibilityCheck[] {
  const checks: { pair: string; fgKey: keyof PaletteTheme; bgKey: keyof PaletteTheme; rec: string }[] = [
    {
      pair: 'Body Text vs Background',
      fgKey: 'text',
      bgKey: 'background',
      rec: 'Body readability requires 4.5:1 (AA) or 7:1 (AAA). Increase lightness of text or deepen background if failing.',
    },
    {
      pair: 'Heading / Link vs Background',
      fgKey: 'link',
      bgKey: 'background',
      rec: 'Interactive links should clearly stand out against background without sacrificing legibility.',
    },
    {
      pair: 'Button Text vs Button',
      fgKey: 'buttonText',
      bgKey: 'button',
      rec: 'Ensure high contrast for call-to-action button labels to minimize user friction.',
    },
    {
      pair: 'Muted Text vs Surface',
      fgKey: 'mutedText',
      bgKey: 'surface',
      rec: 'Secondary metadata requires at least 4.5:1 for standard text legibility.',
    },
    {
      pair: 'Primary Accent vs Background',
      fgKey: 'primary',
      bgKey: 'background',
      rec: 'Brand color on canvas should maintain sufficient contrast for iconography and key visual cues.',
    },
  ];

  return checks.map(({ pair, fgKey, bgKey, rec }) => {
    const fg = palette[fgKey].hex;
    const bg = palette[bgKey].hex;
    const ratio = getContrastRatio(fg, bg);
    const rating = evaluateContrast(ratio);
    return {
      pair,
      foreground: fg,
      background: bg,
      ratio,
      rating,
      recommendation: rating === 'Fail' ? `Increase luminosity delta between ${palette[fgKey].name} and ${palette[bgKey].name}. ${rec}` : undefined,
    };
  });
}

// Export Formats
export function exportToCssVariables(system: ColorSystem): string {
  const light = system.lightPalette;
  const dark = system.darkPalette;

  return `/* ColorForge AI — Exported CSS Variables for ${system.websiteName} */
:root {
  /* Brand Tokens */
  --color-primary: ${light.primary.hex};
  --color-secondary: ${light.secondary.hex};
  --color-accent: ${light.accent.hex};

  /* Surfaces & Canvas */
  --color-background: ${light.background.hex};
  --color-surface: ${light.surface.hex};
  --color-card: ${light.card.hex};
  --color-border: ${light.border.hex};

  /* Typography */
  --color-text: ${light.text.hex};
  --color-muted-text: ${light.mutedText.hex};

  /* Interactive Elements */
  --color-button: ${light.button.hex};
  --color-button-hover: ${light.buttonHover.hex};
  --color-button-text: ${light.buttonText.hex};
  --color-link: ${light.link.hex};
  --color-link-hover: ${light.linkHover.hex};

  /* Feedback States */
  --color-success: ${light.success.hex};
  --color-warning: ${light.warning.hex};
  --color-error: ${light.error.hex};
  --color-info: ${light.info.hex};
}

/* Dark Mode Tokens */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: ${dark.primary.hex};
    --color-secondary: ${dark.secondary.hex};
    --color-accent: ${dark.accent.hex};
    --color-background: ${dark.background.hex};
    --color-surface: ${dark.surface.hex};
    --color-card: ${dark.card.hex};
    --color-border: ${dark.border.hex};
    --color-text: ${dark.text.hex};
    --color-muted-text: ${dark.mutedText.hex};
    --color-button: ${dark.button.hex};
    --color-button-hover: ${dark.buttonHover.hex};
    --color-button-text: ${dark.buttonText.hex};
    --color-link: ${dark.link.hex};
    --color-link-hover: ${dark.linkHover.hex};
    --color-success: ${dark.success.hex};
    --color-warning: ${dark.warning.hex};
    --color-error: ${dark.error.hex};
    --color-info: ${dark.info.hex};
  }
}

.dark {
  --color-primary: ${dark.primary.hex};
  --color-secondary: ${dark.secondary.hex};
  --color-accent: ${dark.accent.hex};
  --color-background: ${dark.background.hex};
  --color-surface: ${dark.surface.hex};
  --color-card: ${dark.card.hex};
  --color-border: ${dark.border.hex};
  --color-text: ${dark.text.hex};
  --color-muted-text: ${dark.mutedText.hex};
  --color-button: ${dark.button.hex};
  --color-button-hover: ${dark.buttonHover.hex};
  --color-button-text: ${dark.buttonText.hex};
  --color-link: ${dark.link.hex};
  --color-link-hover: ${dark.linkHover.hex};
  --color-success: ${dark.success.hex};
  --color-warning: ${dark.warning.hex};
  --color-error: ${dark.error.hex};
  --color-info: ${dark.info.hex};
}`;
}

export function exportToTailwindConfig(system: ColorSystem): string {
  const p = system.activeTheme === 'dark' ? system.darkPalette : system.lightPalette;
  const primaryScales = system.colorScales.primary.reduce((acc, shade) => {
    acc[shade.step] = shade.hex;
    return acc;
  }, {} as Record<string, string>);

  return `// tailwind.config.js - ColorForge AI Theme Extension
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '${p.primary.hex}',
          ...${JSON.stringify(primaryScales, null, 10).replace(/^ {10}/gm, '          ')}
        },
        surface: {
          bg: '${p.background.hex}',
          DEFAULT: '${p.surface.hex}',
          card: '${p.card.hex}',
          border: '${p.border.hex}',
        },
        content: {
          DEFAULT: '${p.text.hex}',
          muted: '${p.mutedText.hex}',
        },
        action: {
          btn: '${p.button.hex}',
          btnHover: '${p.buttonHover.hex}',
          btnText: '${p.buttonText.hex}',
          link: '${p.link.hex}',
          linkHover: '${p.linkHover.hex}',
        },
        status: {
          success: '${p.success.hex}',
          warning: '${p.warning.hex}',
          error: '${p.error.hex}',
          info: '${p.info.hex}',
        }
      }
    }
  }
};`;
}

export function exportToJsonTokens(system: ColorSystem): string {
  return JSON.stringify(
    {
      $schema: 'https://design-tokens.github.io/community-group/format/',
      meta: {
        generator: 'ColorForge AI',
        websiteName: system.websiteName,
        category: system.category,
        style: system.style,
        exportedAt: new Date().toISOString(),
      },
      light: system.lightPalette,
      dark: system.darkPalette,
      scales: system.colorScales,
      brandExplanation: system.brandExplanation,
    },
    null,
    2
  );
}

export function exportToW3cDesignTokens(system: ColorSystem): string {
  const p = system.activeTheme === 'dark' ? system.darkPalette : system.lightPalette;
  return JSON.stringify(
    {
      color: {
        primary: { $value: p.primary.hex, $type: 'color', $description: p.primary.usage },
        secondary: { $value: p.secondary.hex, $type: 'color', $description: p.secondary.usage },
        accent: { $value: p.accent.hex, $type: 'color', $description: p.accent.usage },
        background: { $value: p.background.hex, $type: 'color', $description: p.background.usage },
        surface: { $value: p.surface.hex, $type: 'color', $description: p.surface.usage },
        card: { $value: p.card.hex, $type: 'color', $description: p.card.usage },
        border: { $value: p.border.hex, $type: 'color', $description: p.border.usage },
        text: {
          base: { $value: p.text.hex, $type: 'color', $description: p.text.usage },
          muted: { $value: p.mutedText.hex, $type: 'color', $description: p.mutedText.usage },
        },
        button: {
          background: { $value: p.button.hex, $type: 'color', $description: p.button.usage },
          text: { $value: p.buttonText.hex, $type: 'color', $description: p.buttonText.usage },
          hover: { $value: p.buttonHover.hex, $type: 'color', $description: p.buttonHover.usage },
        },
      },
    },
    null,
    2
  );
}
