export interface ColorRole {
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
  usage: string;
  contrastRatio?: number;
}

export interface ColorScaleShade {
  step: '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';
  hex: string;
  rgb: string;
  hsl: string;
}

export interface AccessibilityCheck {
  pair: string;
  foreground: string;
  background: string;
  ratio: number;
  rating: 'AAA' | 'AA' | 'Fail';
  recommendation?: string;
}

export interface BrandExplanation {
  brandPersonality: string;
  colorPsychology: string;
  whyTheseColorsWork: string;
  recommendedUsage: string[];
  thingsToAvoid: string[];
}

export interface ColorHarmonyGroup {
  type: 'Complementary' | 'Analogous' | 'Triadic' | 'Split Complementary' | 'Tetradic';
  description: string;
  colors: { name: string; hex: string; role: string }[];
}

export interface PaletteTheme {
  primary: ColorRole;
  secondary: ColorRole;
  accent: ColorRole;
  background: ColorRole;
  surface: ColorRole;
  card: ColorRole;
  text: ColorRole;
  mutedText: ColorRole;
  border: ColorRole;
  success: ColorRole;
  warning: ColorRole;
  error: ColorRole;
  info: ColorRole;
  button: ColorRole;
  buttonHover: ColorRole;
  buttonText: ColorRole;
  link: ColorRole;
  linkHover: ColorRole;
}

export interface ColorSystem {
  id: string;
  websiteName: string;
  category: string;
  description: string;
  targetAudience: string;
  style: string;
  themePreference: 'light' | 'dark' | 'both';
  activeTheme: 'light' | 'dark';
  lightPalette: PaletteTheme;
  darkPalette: PaletteTheme;
  colorScales: {
    primary: ColorScaleShade[];
    secondary: ColorScaleShade[];
    accent: ColorScaleShade[];
  };
  brandExplanation: BrandExplanation;
  accessibility: AccessibilityCheck[];
  harmonies: ColorHarmonyGroup[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro';
  generationsUsed: number;
  maxFreeGenerations: number;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  projectName: string;
  websiteName: string;
  category: string;
  description: string;
  targetAudience: string;
  style: string;
  themePreference: 'light' | 'dark' | 'both';
  colorSystem: ColorSystem;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationHistoryItem {
  id: string;
  userId: string;
  websiteName: string;
  category: string;
  style: string;
  promptSummary: string;
  primaryHex: string;
  secondaryHex: string;
  backgroundHex: string;
  textHex: string;
  colorSystem: ColorSystem;
  createdAt: string;
}

export interface ColorAnalysisResult {
  hex: string;
  rgb: string;
  hsl: string;
  name: string;
  psychology: string;
  bestUse: string[];
  accessibilityNotes: string;
  harmonies: ColorHarmonyGroup[];
  suggestedPalette: PaletteTheme;
}
