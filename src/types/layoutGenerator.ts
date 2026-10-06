export type WebsiteCategoryType =
  | 'SaaS'
  | 'Portfolio'
  | 'Agency'
  | 'E-commerce'
  | 'Restaurant'
  | 'Blog'
  | 'Education'
  | 'Healthcare'
  | 'Real Estate'
  | 'Finance'
  | 'Landing Page'
  | 'Dashboard';

export type LayoutVariationStyle =
  | 'Modern'
  | 'Minimal'
  | 'Premium'
  | 'Bold'
  | 'Corporate';

export type PreviewDeviceMode = 'desktop' | 'tablet' | 'mobile';

export interface SelectedPaletteColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

export interface DerivedShades {
  primaryHover: string;
  primaryActive: string;
  primaryMuted: string;
  secondaryHover: string;
  accentHover: string;
  accentMuted: string;
  surfaceBorder: string;
  mutedText: string;
  subtleBg: string;
  cardBg: string;
}

export interface AIDesignAnalysisData {
  harmonyScore: number; // e.g. 94
  contrastRating: string; // e.g. "Excellent (14.2:1)"
  accessibilityGrade: 'AAA' | 'AA' | 'AA Large';
  styleName: string; // e.g. "Modern Premium"
  primaryUsage: string; // e.g. "Primary CTA buttons, active states, key focus points"
  secondaryUsage: string; // e.g. "Supporting cards, structural navigation, secondary badges"
  accentUsage: string; // e.g. "High-intent badges, highlight markers, alert indicators"
  recommendedRadius: string; // e.g. "12px"
  recommendedTypography: string; // e.g. "Plus Jakarta Sans / Inter"
  whyColorsWork: string;
}

export interface LayoutComponentConfig {
  heroLayout: 'split' | 'centered' | 'editorial' | 'cards-overlap';
  cardElevation: 'bordered' | 'flat' | 'glow-border' | 'subtle-shadow';
  borderRadius: 'rounded-lg' | 'rounded-xl' | 'rounded-2xl';
  spacingDensity: 'compact' | 'normal' | 'relaxed';
  navStyle: 'floating' | 'solid' | 'bordered';
  pricingStyle: 'three-tier' | 'highlight-middle' | 'two-column';
}

export interface GeneratedWebsiteContent {
  brandName: string;
  tagline: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  primaryCta: string;
  secondaryCta: string;
  featuresTitle: string;
  featuresSubtitle: string;
  features: Array<{ title: string; desc: string; icon: string; stat?: string }>;
  stats?: Array<{ label: string; value: string }>;
  testimonials?: Array<{ quote: string; author: string; role: string; company?: string; rating?: number }>;
  pricingTiers?: Array<{ name: string; price: string; period: string; desc: string; features: string[]; popular?: boolean }>;
  faqs?: Array<{ question: string; answer: string }>;
  categorySpecific?: Record<string, any>;
}

export interface LayoutDesignSpec {
  id: string;
  websiteType: WebsiteCategoryType;
  variationStyle: LayoutVariationStyle;
  colors: SelectedPaletteColors;
  derived: DerivedShades;
  analysis: AIDesignAnalysisData;
  layout: LayoutComponentConfig;
  content: GeneratedWebsiteContent;
  createdAt: string;
}
