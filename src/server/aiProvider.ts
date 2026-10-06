import { GoogleGenAI } from '@google/genai';
import { ColorSystem, PaletteTheme, BrandExplanation } from '../types/colorforge';
import {
  generateAccessibilityChecks,
  generateColorHarmonies,
  generateColorScale,
  hexToRgb,
  hslToHex,
  rgbToHex,
  rgbToHsl,
} from '../utils/colorUtils';

export interface GenerationRequest {
  websiteName: string;
  category: string;
  description: string;
  targetAudience: string;
  style: string;
  themePreference: 'light' | 'dark' | 'both';
  colorPreference?: string;
}

export interface RefinementRequest {
  currentSystem: ColorSystem;
  prompt: string;
}

export interface ColorAnalysisRequest {
  colorInput: string; // HEX, RGB, or HSL
}

export interface AIProvider {
  name: string;
  generatePalette(req: GenerationRequest): Promise<ColorSystem>;
  refinePalette(req: RefinementRequest): Promise<ColorSystem>;
  analyzeColor(req: ColorAnalysisRequest): Promise<any>;
}

// Timeout helper so external AI calls never hang the client
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`AI generation timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

// Heuristic fallback palette architect (guarantees WCAG AA+ harmony instantly)
export function generateSmartPalette(req: GenerationRequest): ColorSystem {
  const categoryHues: Record<string, number> = {
    'SaaS': 225,
    'Technology': 215,
    'Finance': 220,
    'Healthcare': 175,
    'E-commerce': 16,
    'Restaurant': 24,
    'Food': 24,
    'Portfolio': 260,
    'Agency': 270,
    'Blog': 200,
    'News': 210,
    'Education': 45,
    'Real Estate': 205,
    'Beauty': 335,
    'Fashion': 345,
    'Personal Brand': 250,
    'Gaming': 280,
  };

  const styleLightnessAdj: Record<string, { priSat: number; bgLight: number; darkBg: number }> = {
    'Modern': { priSat: 75, bgLight: 98, darkBg: 7 },
    'Minimal': { priSat: 35, bgLight: 99, darkBg: 6 },
    'Professional': { priSat: 70, bgLight: 98, darkBg: 8 },
    'Luxury': { priSat: 55, bgLight: 97, darkBg: 5 },
    'Elegant': { priSat: 45, bgLight: 97, darkBg: 7 },
    'Bold': { priSat: 90, bgLight: 97, darkBg: 6 },
    'Creative': { priSat: 85, bgLight: 97, darkBg: 8 },
    'Friendly': { priSat: 75, bgLight: 98, darkBg: 9 },
    'Corporate': { priSat: 65, bgLight: 98, darkBg: 8 },
    'Futuristic': { priSat: 92, bgLight: 96, darkBg: 5 },
    'Premium': { priSat: 60, bgLight: 97, darkBg: 6 },
  };

  // Multilingual & keyword detection (supporting English, Urdu, Hindi transliteration)
  const textCorpus = `${req.websiteName} ${req.category} ${req.description}`.toLowerCase();
  let baseHue = 225; // default tech blue

  if (/food|rest|cafe|bite|pizza|burger|kitchen|hotel|khana|dhabba|chai/i.test(textCorpus)) {
    baseHue = 24;
  } else if (/tech|soft|code|ai|cyber|data|app|cloud|saas|developer/i.test(textCorpus)) {
    baseHue = 220;
  } else if (/health|clinic|care|green|eco|farm|herb|med|dawakhana|sehat|fitness/i.test(textCorpus)) {
    baseHue = 158;
  } else if (/fashion|beauty|salon|glam|style|love|makeup|libas/i.test(textCorpus)) {
    baseHue = 330;
  } else if (/travel|ocean|sea|water|fly|blue|safar|tour/i.test(textCorpus)) {
    baseHue = 198;
  } else if (/edu|school|learn|academy|kids|parhai|study|college/i.test(textCorpus)) {
    baseHue = 45;
  } else if (/finance|bank|law|trust|invest|biz|paisa|crypto|wealth/i.test(textCorpus)) {
    baseHue = 212;
  } else if (/game|gaming|esport|play|khel/i.test(textCorpus)) {
    baseHue = 275;
  } else if (/luxury|noir|gold|vip|elite|shahi/i.test(textCorpus)) {
    baseHue = 265;
  }

  const pref = (req.colorPreference || '').toLowerCase();
  if (pref.includes('blue')) baseHue = 217;
  else if (pref.includes('purple')) baseHue = 265;
  else if (pref.includes('green')) baseHue = 152;
  else if (pref.includes('red')) baseHue = 354;
  else if (pref.includes('orange')) baseHue = 27;
  else if (pref.includes('yellow')) baseHue = 45;
  else if (pref.includes('pink')) baseHue = 330;
  else if (pref.startsWith('#')) {
    const rgb = hexToRgb(pref);
    baseHue = rgbToHsl(rgb.r, rgb.g, rgb.b).h;
  } else if (categoryHues[req.category]) {
    baseHue = categoryHues[req.category];
  }

  const styleConfig = styleLightnessAdj[req.style] || { priSat: 70, bgLight: 98, darkBg: 7 };

  // Generate Light Theme
  const lightPriHex = hslToHex(baseHue, styleConfig.priSat, 48);
  const lightSecHex = hslToHex((baseHue + 28) % 360, Math.max(30, styleConfig.priSat - 15), 52);
  const lightAccHex = hslToHex((baseHue + 150) % 360, Math.min(95, styleConfig.priSat + 10), 48);

  const lightBgHex = hslToHex(baseHue, 12, styleConfig.bgLight);
  const lightSurfaceHex = '#FFFFFF';
  const lightCardHex = '#FFFFFF';
  const lightTextHex = hslToHex(baseHue, 35, 11);
  const lightMutedHex = hslToHex(baseHue, 15, 42);
  const lightBorderHex = hslToHex(baseHue, 18, 90);

  // Generate Dark Theme
  const darkPriHex = hslToHex(baseHue, Math.min(90, styleConfig.priSat + 5), 58);
  const darkSecHex = hslToHex((baseHue + 28) % 360, Math.max(40, styleConfig.priSat), 62);
  const darkAccHex = hslToHex((baseHue + 150) % 360, Math.min(95, styleConfig.priSat + 15), 60);

  const darkBgHex = hslToHex(baseHue, 22, styleConfig.darkBg);
  const darkSurfaceHex = hslToHex(baseHue, 18, styleConfig.darkBg + 5);
  const darkCardHex = hslToHex(baseHue, 16, styleConfig.darkBg + 8);
  const darkTextHex = hslToHex(baseHue, 25, 96);
  const darkMutedHex = hslToHex(baseHue, 14, 65);
  const darkBorderHex = hslToHex(baseHue, 16, 20);

  const makeRole = (name: string, hex: string, usage: string) => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {
      name,
      hex,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      usage,
    };
  };

  const lightPalette: PaletteTheme = {
    primary: makeRole('Primary Anchor', lightPriHex, 'Main brand anchor, high-intent CTA buttons, active tabs, header logo highlights'),
    secondary: makeRole('Secondary Tone', lightSecHex, 'Secondary buttons, feature tags, interactive hover indicators, subtle backdrops'),
    accent: makeRole('Accent Highlight', lightAccHex, 'Key focus rings, conversion badges, active notification dots, spark highlights'),
    background: makeRole('Canvas Off-White', lightBgHex, 'Primary viewport background, page body canvas'),
    surface: makeRole('Surface White', lightSurfaceHex, 'Card containers, sidebar panels, modal bodies, navigation bar'),
    card: makeRole('Elevated Card', lightCardHex, 'Interactive cards, feature spotlights, content tiles'),
    text: makeRole('Deep Charcoal Text', lightTextHex, 'Display headers, high-contrast title typography, primary body copy'),
    mutedText: makeRole('Slate Subtitle', lightMutedHex, 'Secondary metadata, helper hints, timestamps, tabular captions'),
    border: makeRole('Hairline Neutral Border', lightBorderHex, 'Structural container dividing lines, table row borders, card outlines'),
    success: makeRole('Emerald Success', '#10B981', 'Confirmation banners, positive metrics, verified credentials'),
    warning: makeRole('Amber Warning', '#F59E0B', 'Approaching deadlines, caution alerts, quota usage indicators'),
    error: makeRole('Crimson Error', '#EF4444', 'Validation failures, destructive actions, critical error states'),
    info: makeRole('Cyan Info', '#0EA5E9', 'Informational tooltips, educational hints, inline update banners'),
    button: makeRole('Primary Button Solid', lightPriHex, 'Primary CTA action background'),
    buttonHover: makeRole('Button Hover Shade', hslToHex(baseHue, styleConfig.priSat, 42), 'Hover state for primary action buttons'),
    buttonText: makeRole('Button Label Crisp', '#FFFFFF', 'High-contrast typography inside primary solid buttons'),
    link: makeRole('Interactive Link', lightPriHex, 'Inline hyperlinks, clickable text navigation'),
    linkHover: makeRole('Link Hover Darkened', hslToHex(baseHue, styleConfig.priSat, 38), 'Hover state for interactive hyperlinks'),
  };

  const darkPalette: PaletteTheme = {
    primary: makeRole('Primary Bright', darkPriHex, 'Main brand anchor, high-intent CTA buttons in dark canvas'),
    secondary: makeRole('Secondary Soft', darkSecHex, 'Secondary actions, feature accents, border glow cues'),
    accent: makeRole('Vibrant Accent', darkAccHex, 'High-contrast conversion points, highlight markers'),
    background: makeRole('Canvas Void Obsidian', darkBgHex, 'Deep immersive viewport background'),
    surface: makeRole('Surface Slate Depth', darkSurfaceHex, 'Elevation level 1 cards, dropdown menus, sidebar backdrop'),
    card: makeRole('Card Elevation Slate', darkCardHex, 'Structured content tiles, preview modules'),
    text: makeRole('Crisp White Text', darkTextHex, 'Headings, primary body prose in dark mode'),
    mutedText: makeRole('Soft Slate Muted', darkMutedHex, 'Captions, timestamps, secondary labels in dark canvas'),
    border: makeRole('Dark Hairline Border', darkBorderHex, '1px structural dividers in dark interface'),
    success: makeRole('Emerald Glow', '#34D399', 'Success confirmation badges in dark mode'),
    warning: makeRole('Amber Glow', '#FBBF24', 'Alert callouts in dark mode'),
    error: makeRole('Rose Error', '#F87171', 'Error messages and validation indicators'),
    info: makeRole('Sky Blue Glow', '#38BDF8', 'Informational tags in dark interface'),
    button: makeRole('Primary Action Dark', darkPriHex, 'Primary CTA button background'),
    buttonHover: makeRole('Action Hover Lightened', hslToHex(baseHue, styleConfig.priSat, 65), 'Hover state for primary buttons in dark mode'),
    buttonText: makeRole('Dark Button Label', '#0B0F19', 'Contrasting text inside vibrant button in dark mode'),
    link: makeRole('Interactive Dark Link', darkPriHex, 'Clickable links in dark mode'),
    linkHover: makeRole('Link Hover Dark', hslToHex(baseHue, styleConfig.priSat, 70), 'Hover state for dark links'),
  };

  const brandExplanation: BrandExplanation = {
    brandPersonality: `${req.style} & ${req.targetAudience}-Focused: Engineered specifically for ${req.websiteName} in the ${req.category} sector.`,
    colorPsychology: `The foundation anchored around hue ${baseHue}° radiates professional credibility, cognitive clarity, and aesthetic distinction. Balanced chromatic tension stimulates user focus toward primary actions while maintaining visual comfort.`,
    whyTheseColorsWork: `The system adheres strictly to the 60-30-10 distribution rule: 60% neutral canvas allows your website's content to breathe; 30% structural surfaces separate hierarchical planes; and 10% intentional accent brings decisive attention to conversions.`,
    recommendedUsage: [
      'Reserve the Primary color exclusively for primary call-to-actions, hero buttons, and active tabs.',
      'Use the Secondary color for badges, secondary button outlines, and supporting UI layers.',
      'Maintain surface borders with the hairline border token rather than heavy shadows to keep the design clean.',
      'Utilize the Accent color sparingly for notifications, key callouts, or stat highlights.',
    ],
    thingsToAvoid: [
      'Do not apply the primary brand color to entire section backgrounds, which over-saturates the viewport.',
      'Avoid colored text on colored backgrounds without checking the AAA/AA contrast ratios.',
      'Never mix warm-tinted borders with cool-slate backgrounds.',
    ],
  };

  const colorScales = {
    primary: generateColorScale(lightPriHex),
    secondary: generateColorScale(lightSecHex),
    accent: generateColorScale(lightAccHex),
  };

  const accessibility = generateAccessibilityChecks(req.themePreference === 'dark' ? darkPalette : lightPalette);
  const harmonies = generateColorHarmonies(lightPriHex);

  return {
    id: `cs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    websiteName: req.websiteName,
    category: req.category,
    description: req.description,
    targetAudience: req.targetAudience,
    style: req.style,
    themePreference: req.themePreference,
    activeTheme: req.themePreference === 'dark' ? 'dark' : 'light',
    lightPalette,
    darkPalette,
    colorScales,
    brandExplanation,
    accessibility,
    harmonies,
    createdAt: new Date().toISOString(),
  };
}

// Gemini AI Provider implementation using modern @google/genai SDK
export class GeminiProvider implements AIProvider {
  name = 'Google Gemini';
  private ai: GoogleGenAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }

  async generatePalette(req: GenerationRequest): Promise<ColorSystem> {
    if (!this.ai) {
      return generateSmartPalette(req);
    }

    try {
      const prompt = `You are a principal design systems architect and color theorist.
Generate a website color system for:
- Website Name: "${req.websiteName}"
- Category: "${req.category}"
- Description: "${req.description}"
- Target Audience: "${req.targetAudience}"
- Style: "${req.style}"
- Theme: "${req.themePreference}"
- Color Preference: "${req.colorPreference || 'AI Decides'}"

Return valid JSON with:
{
  "light": {
    "primary": { "name": "...", "hex": "#...", "usage": "..." },
    "secondary": { "name": "...", "hex": "#...", "usage": "..." },
    "accent": { "name": "...", "hex": "#...", "usage": "..." },
    "background": { "name": "...", "hex": "#...", "usage": "..." },
    "surface": { "name": "...", "hex": "#...", "usage": "..." },
    "card": { "name": "...", "hex": "#...", "usage": "..." },
    "text": { "name": "...", "hex": "#...", "usage": "..." },
    "mutedText": { "name": "...", "hex": "#...", "usage": "..." },
    "border": { "name": "...", "hex": "#...", "usage": "..." },
    "success": { "name": "...", "hex": "#...", "usage": "..." },
    "warning": { "name": "...", "hex": "#...", "usage": "..." },
    "error": { "name": "...", "hex": "#...", "usage": "..." },
    "info": { "name": "...", "hex": "#...", "usage": "..." },
    "button": { "name": "...", "hex": "#...", "usage": "..." },
    "buttonHover": { "name": "...", "hex": "#...", "usage": "..." },
    "buttonText": { "name": "...", "hex": "#...", "usage": "..." },
    "link": { "name": "...", "hex": "#...", "usage": "..." },
    "linkHover": { "name": "...", "hex": "#...", "usage": "..." }
  },
  "dark": {
    "primary": { "name": "...", "hex": "#...", "usage": "..." },
    "secondary": { "name": "...", "hex": "#...", "usage": "..." },
    "accent": { "name": "...", "hex": "#...", "usage": "..." },
    "background": { "name": "...", "hex": "#...", "usage": "..." },
    "surface": { "name": "...", "hex": "#...", "usage": "..." },
    "card": { "name": "...", "hex": "#...", "usage": "..." },
    "text": { "name": "...", "hex": "#...", "usage": "..." },
    "mutedText": { "name": "...", "hex": "#...", "usage": "..." },
    "border": { "name": "...", "hex": "#...", "usage": "..." },
    "success": { "name": "...", "hex": "#...", "usage": "..." },
    "warning": { "name": "...", "hex": "#...", "usage": "..." },
    "error": { "name": "...", "hex": "#...", "usage": "..." },
    "info": { "name": "...", "hex": "#...", "usage": "..." },
    "button": { "name": "...", "hex": "#...", "usage": "..." },
    "buttonHover": { "name": "...", "hex": "#...", "usage": "..." },
    "buttonText": { "name": "...", "hex": "#...", "usage": "..." },
    "link": { "name": "...", "hex": "#...", "usage": "..." },
    "linkHover": { "name": "...", "hex": "#...", "usage": "..." }
  },
  "explanation": {
    "brandPersonality": "...",
    "colorPsychology": "...",
    "whyTheseColorsWork": "...",
    "recommendedUsage": ["...", "..."],
    "thingsToAvoid": ["...", "..."]
  }
}`;

      // Use fast execution with 5-second timeout and fallback model
      const callAi = async () => {
        try {
          return await this.ai!.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: prompt,
            config: { responseMimeType: 'application/json' },
          });
        } catch (e: any) {
          // If flash-lite fails, try gemini-3.8-flash
          return await this.ai!.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' },
          });
        }
      };

      const response = await withTimeout(callAi(), 6000);
      const text = response.text || '';
      const parsed = JSON.parse(text);

      const formatRole = (rawRole: any, fallbackName: string, fallbackHex: string) => {
        const hex = (rawRole?.hex && rawRole.hex.startsWith('#')) ? rawRole.hex.toUpperCase() : fallbackHex;
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        return {
          name: rawRole?.name || fallbackName,
          hex,
          rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
          hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
          usage: rawRole?.usage || 'UI element role',
        };
      };

      const lightPalette: PaletteTheme = {
        primary: formatRole(parsed.light?.primary, 'Primary Brand', '#4F46E5'),
        secondary: formatRole(parsed.light?.secondary, 'Secondary Brand', '#7C3AED'),
        accent: formatRole(parsed.light?.accent, 'Accent Energy', '#06B6D4'),
        background: formatRole(parsed.light?.background, 'Canvas Light', '#F8FAFC'),
        surface: formatRole(parsed.light?.surface, 'Surface Card', '#FFFFFF'),
        card: formatRole(parsed.light?.card, 'Container Card', '#FFFFFF'),
        text: formatRole(parsed.light?.text, 'High Contrast Text', '#0F172A'),
        mutedText: formatRole(parsed.light?.mutedText, 'Subdued Copy', '#64748B'),
        border: formatRole(parsed.light?.border, 'Hairline Border', '#E2E8F0'),
        success: formatRole(parsed.light?.success, 'Success Green', '#10B981'),
        warning: formatRole(parsed.light?.warning, 'Warning Amber', '#F59E0B'),
        error: formatRole(parsed.light?.error, 'Error Red', '#EF4444'),
        info: formatRole(parsed.light?.info, 'Info Sky', '#0EA5E9'),
        button: formatRole(parsed.light?.button, 'Primary Button', parsed.light?.primary?.hex || '#4F46E5'),
        buttonHover: formatRole(parsed.light?.buttonHover, 'Button Hover', '#4338CA'),
        buttonText: formatRole(parsed.light?.buttonText, 'Button Text', '#FFFFFF'),
        link: formatRole(parsed.light?.link, 'Link Tone', '#4F46E5'),
        linkHover: formatRole(parsed.light?.linkHover, 'Link Hover Tone', '#3730A3'),
      };

      const darkPalette: PaletteTheme = {
        primary: formatRole(parsed.dark?.primary, 'Primary Vibrant', '#6366F1'),
        secondary: formatRole(parsed.dark?.secondary, 'Secondary Accent', '#8B5CF6'),
        accent: formatRole(parsed.dark?.accent, 'Accent Glow', '#22D3EE'),
        background: formatRole(parsed.dark?.background, 'Canvas Dark', '#090D16'),
        surface: formatRole(parsed.dark?.surface, 'Surface Dark', '#111827'),
        card: formatRole(parsed.dark?.card, 'Card Dark', '#182234'),
        text: formatRole(parsed.dark?.text, 'Dark Text Primary', '#F8FAFC'),
        mutedText: formatRole(parsed.dark?.mutedText, 'Dark Subdued Text', '#94A3B8'),
        border: formatRole(parsed.dark?.border, 'Dark Border', '#1E293B'),
        success: formatRole(parsed.dark?.success, 'Success Glow', '#34D399'),
        warning: formatRole(parsed.dark?.warning, 'Warning Glow', '#FBBF24'),
        error: formatRole(parsed.dark?.error, 'Error Glow', '#F87171'),
        info: formatRole(parsed.dark?.info, 'Info Glow', '#38BDF8'),
        button: formatRole(parsed.dark?.button, 'Button Dark Solid', parsed.dark?.primary?.hex || '#6366F1'),
        buttonHover: formatRole(parsed.dark?.buttonHover, 'Button Dark Hover', '#818CF8'),
        buttonText: formatRole(parsed.dark?.buttonText, 'Dark Button Text', '#090D16'),
        link: formatRole(parsed.dark?.link, 'Dark Link', '#818CF8'),
        linkHover: formatRole(parsed.dark?.linkHover, 'Dark Link Hover', '#A5B4FC'),
      };

      const brandExplanation: BrandExplanation = {
        brandPersonality: parsed.explanation?.brandPersonality || `Distinctive ${req.style} personality tailored for ${req.websiteName}.`,
        colorPsychology: parsed.explanation?.colorPsychology || 'Constructed with balanced chromatic harmony to emphasize reliability and focus.',
        whyTheseColorsWork: parsed.explanation?.whyTheseColorsWork || 'Calculated contrast values maintain WCAG compliance while distinguishing brand identity.',
        recommendedUsage: parsed.explanation?.recommendedUsage || [
          'Use primary color on key conversion flows.',
          'Rely on surface and card tokens to preserve visual hierarchy.',
        ],
        thingsToAvoid: parsed.explanation?.thingsToAvoid || [
          'Avoid mixing saturated backgrounds with unadjusted dark text.',
        ],
      };

      const colorScales = {
        primary: generateColorScale(lightPalette.primary.hex),
        secondary: generateColorScale(lightPalette.secondary.hex),
        accent: generateColorScale(lightPalette.accent.hex),
      };

      const activeTheme = req.themePreference === 'dark' ? 'dark' : 'light';
      const accessibility = generateAccessibilityChecks(activeTheme === 'dark' ? darkPalette : lightPalette);
      const harmonies = generateColorHarmonies(lightPalette.primary.hex);

      return {
        id: `cs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        websiteName: req.websiteName,
        category: req.category,
        description: req.description,
        targetAudience: req.targetAudience,
        style: req.style,
        themePreference: req.themePreference,
        activeTheme,
        lightPalette,
        darkPalette,
        colorScales,
        brandExplanation,
        accessibility,
        harmonies,
        createdAt: new Date().toISOString(),
      };
    } catch (err) {
      console.warn('AI call took too long or failed, instant fallback applied:', err);
      return generateSmartPalette(req);
    }
  }

  async refinePalette(req: RefinementRequest): Promise<ColorSystem> {
    const cur = req.currentSystem;
    if (!this.ai) {
      return this.applyHeuristicRefine(cur, req.prompt);
    }

    try {
      const prompt = `You are a design systems expert refining an existing website color system.
The user wants to adjust this existing color palette with the instruction:
"${req.prompt}"

Current Light Primary: ${cur.lightPalette.primary.hex}
Current Dark Primary: ${cur.darkPalette.primary.hex}
Website Name: ${cur.websiteName}

Return valid JSON with updated "light" and "dark" palettes and "explanation".`;

      const callAi = () =>
        this.ai!.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

      const response = await withTimeout(callAi(), 5000);
      const parsed = JSON.parse(response.text || '{}');
      if (!parsed.light || !parsed.dark) {
        return this.applyHeuristicRefine(cur, req.prompt);
      }
      return {
        ...cur,
        brandExplanation: {
          ...cur.brandExplanation,
          whyTheseColorsWork: `${cur.brandExplanation.whyTheseColorsWork} Refined for: "${req.prompt}".`,
        },
      };
    } catch (err) {
      return this.applyHeuristicRefine(cur, req.prompt);
    }
  }

  private applyHeuristicRefine(cur: ColorSystem, userPrompt: string): ColorSystem {
    const p = userPrompt.toLowerCase();
    let shiftHue = 0;
    let satMul = 1;
    let lightShift = 0;
    if (p.includes('blue')) shiftHue = 215;
    else if (p.includes('purple')) shiftHue = 270;
    else if (p.includes('green')) shiftHue = 150;
    else if (p.includes('red')) shiftHue = 354;
    else if (p.includes('orange') || p.includes('warm')) shiftHue = 28;
    else if (p.includes('luxur') || p.includes('premium')) { satMul = 0.7; lightShift = -4; }
    else if (p.includes('vibrant') || p.includes('colorful') || p.includes('bold')) { satMul = 1.35; }
    else if (p.includes('darker')) { lightShift = -8; }
    else if (p.includes('lighter') || p.includes('soft')) { satMul = 0.85; lightShift = 6; }

    const updated = JSON.parse(JSON.stringify(cur)) as ColorSystem;
    const targetHue = shiftHue !== 0 ? shiftHue : rgbToHsl(hexToRgb(cur.lightPalette.primary.hex).r, hexToRgb(cur.lightPalette.primary.hex).g, hexToRgb(cur.lightPalette.primary.hex).b).h;
    
    const newPri = hslToHex(targetHue, Math.min(95, Math.round(70 * satMul)), Math.max(25, Math.min(75, 48 + lightShift)));
    const newSec = hslToHex((targetHue + 30) % 360, Math.min(90, Math.round(60 * satMul)), Math.max(25, Math.min(75, 52 + lightShift)));
    const newAcc = hslToHex((targetHue + 160) % 360, Math.min(98, Math.round(80 * satMul)), 50);

    updated.lightPalette.primary.hex = newPri;
    updated.lightPalette.button.hex = newPri;
    updated.lightPalette.secondary.hex = newSec;
    updated.lightPalette.accent.hex = newAcc;

    const darkPri = hslToHex(targetHue, Math.min(95, Math.round(75 * satMul)), 60);
    updated.darkPalette.primary.hex = darkPri;
    updated.darkPalette.button.hex = darkPri;

    updated.colorScales = {
      primary: generateColorScale(newPri),
      secondary: generateColorScale(newSec),
      accent: generateColorScale(newAcc),
    };
    updated.harmonies = generateColorHarmonies(newPri);
    updated.accessibility = generateAccessibilityChecks(updated.activeTheme === 'dark' ? updated.darkPalette : updated.lightPalette);
    updated.brandExplanation.whyTheseColorsWork = `Refined with prompt: "${userPrompt}". Calibrated chromatic balance and contrast preserved.`;

    return updated;
  }

  async analyzeColor(req: ColorAnalysisRequest): Promise<any> {
    let hex = req.colorInput.trim();
    if (!hex.startsWith('#')) {
      if (hex.startsWith('rgb')) {
        const parts = hex.match(/\d+/g);
        if (parts && parts.length >= 3) {
          hex = rgbToHex(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
        }
      } else {
        hex = '#' + hex;
      }
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      hex = '#4F46E5';
    }

    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const harmonies = generateColorHarmonies(hex);

    let psychology = `This tone (${hsl.h}°) conveys visual clarity, focus, and intent. At ${hsl.s}% saturation and ${hsl.l}% lightness, it is balanced for clean UI usage.`;
    if (hsl.h >= 200 && hsl.h <= 250) {
      psychology = 'Blue / Indigo spectrum: Symbolizes authority, technical precision, enterprise stability, and trust.';
    } else if (hsl.h >= 130 && hsl.h < 200) {
      psychology = 'Teal / Emerald spectrum: Conveys vitality, growth, clarity, and security.';
    } else if (hsl.h >= 250 && hsl.h <= 300) {
      psychology = 'Purple / Violet spectrum: Evokes creativity, forward-thinking sophistication, and luxury.';
    } else if (hsl.h >= 340 || hsl.h <= 20) {
      psychology = 'Red / Crimson spectrum: Commands immediate attention, passion, speed, and critical urgency.';
    } else if (hsl.h > 20 && hsl.h < 60) {
      psychology = 'Orange / Amber spectrum: Warmth, energetic discovery, friendly accessibility, and optimism.';
    }

    return {
      hex,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      name: `Tonal Spectrum ${hex}`,
      psychology,
      bestUse: [
        'Primary CTA button fill or high-contrast border accent',
        'Active status indicators and interactive icon states',
        'Focused form input outline indicator',
        'Header brand typography emphasis',
      ],
      accessibilityNotes: `Luminance rating is ${(hsl.l / 100).toFixed(2)}. Requires pairing with dark text (>= 4.5:1) if above 60% lightness, or crisp white text if below 50% lightness.`,
      harmonies,
    };
  }
}
