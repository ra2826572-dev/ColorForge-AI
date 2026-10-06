import {
  AIDesignAnalysisData,
  DerivedShades,
  GeneratedWebsiteContent,
  LayoutComponentConfig,
  LayoutDesignSpec,
  LayoutVariationStyle,
  SelectedPaletteColors,
  WebsiteCategoryType,
} from '../types/layoutGenerator';
import {
  getContrastRatio,
  hexToRgb,
  hslToHex,
  rgbToHsl,
  getRelativeLuminance,
} from './colorUtils';

/**
 * Mathematically derives subtle UI states (hover, border, muted text, active)
 * exclusively from the user's selected 6 colors.
 */
export function deriveShadesFromPalette(colors: SelectedPaletteColors): DerivedShades {
  const priRgb = hexToRgb(colors.primary);
  const priHsl = rgbToHsl(priRgb.r, priRgb.g, priRgb.b);

  const secRgb = hexToRgb(colors.secondary);
  const secHsl = rgbToHsl(secRgb.r, secRgb.g, secRgb.b);

  const accRgb = hexToRgb(colors.accent);
  const accHsl = rgbToHsl(accRgb.r, accRgb.g, accRgb.b);

  const bgRgb = hexToRgb(colors.background);
  const bgHsl = rgbToHsl(bgRgb.r, bgRgb.g, bgRgb.b);
  const isDarkCanvas = bgHsl.l < 50;

  const surfRgb = hexToRgb(colors.surface);
  const surfHsl = rgbToHsl(surfRgb.r, surfRgb.g, surfRgb.b);

  const textRgb = hexToRgb(colors.text);
  const textHsl = rgbToHsl(textRgb.r, textRgb.g, textRgb.b);

  // Primary hover: darker on light canvas, brighter on dark canvas
  const priHoverLight = isDarkCanvas
    ? Math.min(85, priHsl.l + 8)
    : Math.max(20, priHsl.l - 8);
  const primaryHover = hslToHex(priHsl.h, priHsl.s, priHoverLight);

  const priActiveLight = isDarkCanvas
    ? Math.min(90, priHsl.l + 14)
    : Math.max(15, priHsl.l - 14);
  const primaryActive = hslToHex(priHsl.h, priHsl.s, priActiveLight);

  // Primary muted background for tags/chips (15% saturation, soft light)
  const primaryMuted = isDarkCanvas
    ? hslToHex(priHsl.h, Math.min(50, priHsl.s), Math.max(12, bgHsl.l + 6))
    : hslToHex(priHsl.h, Math.min(40, priHsl.s), 94);

  // Secondary hover
  const secHoverLight = isDarkCanvas
    ? Math.min(85, secHsl.l + 7)
    : Math.max(20, secHsl.l - 7);
  const secondaryHover = hslToHex(secHsl.h, secHsl.s, secHoverLight);

  // Accent hover & muted
  const accHoverLight = isDarkCanvas
    ? Math.min(85, accHsl.l + 8)
    : Math.max(20, accHsl.l - 8);
  const accentHover = hslToHex(accHsl.h, accHsl.s, accHoverLight);
  const accentMuted = isDarkCanvas
    ? hslToHex(accHsl.h, Math.min(45, accHsl.s), Math.max(14, bgHsl.l + 8))
    : hslToHex(accHsl.h, Math.min(45, accHsl.s), 93);

  // Surface border (subtle 1px border that contrasts gently with surface)
  const surfaceBorder = isDarkCanvas
    ? hslToHex(surfHsl.h, Math.max(8, surfHsl.s * 0.5), Math.min(30, surfHsl.l + 10))
    : hslToHex(surfHsl.h, Math.max(8, surfHsl.s * 0.4), Math.max(80, surfHsl.l - 10));

  // Muted text (secondary copy)
  const mutedTextLight = isDarkCanvas
    ? Math.max(55, textHsl.l - 30)
    : Math.min(48, textHsl.l + 32);
  const mutedText = hslToHex(textHsl.h, Math.max(8, textHsl.s * 0.4), mutedTextLight);

  // Subtle background for alternating sections
  const subtleBg = isDarkCanvas
    ? hslToHex(bgHsl.h, bgHsl.s, Math.min(18, bgHsl.l + 4))
    : hslToHex(bgHsl.h, bgHsl.s, Math.max(92, bgHsl.l - 3));

  const cardBg = colors.surface;

  return {
    primaryHover,
    primaryActive,
    primaryMuted,
    secondaryHover,
    accentHover,
    accentMuted,
    surfaceBorder,
    mutedText,
    subtleBg,
    cardBg,
  };
}

/**
 * Computes AI Design Analysis metrics (Harmony score, contrast, accessibility, recommendations)
 */
export function generateAIDesignAnalysis(
  colors: SelectedPaletteColors,
  websiteType: WebsiteCategoryType,
  variationStyle: LayoutVariationStyle
): AIDesignAnalysisData {
  const textContrast = getContrastRatio(colors.text, colors.background);
  const btnContrast = getContrastRatio(colors.text, colors.primary);

  // Calculate harmony score (85 - 98 based on chromatic delta & contrast)
  const priHsl = rgbToHsl(hexToRgb(colors.primary).r, hexToRgb(colors.primary).g, hexToRgb(colors.primary).b);
  const secHsl = rgbToHsl(hexToRgb(colors.secondary).r, hexToRgb(colors.secondary).g, hexToRgb(colors.secondary).b);
  const hueDelta = Math.abs(priHsl.h - secHsl.h);

  let harmonyScore = 91;
  if (hueDelta >= 20 && hueDelta <= 180) harmonyScore += 4;
  if (textContrast >= 7.0) harmonyScore += 3;
  if (harmonyScore > 98) harmonyScore = 98;

  const contrastRating = textContrast >= 7.0
    ? `Excellent (${textContrast}:1)`
    : textContrast >= 4.5
    ? `Good (${textContrast}:1)`
    : `Adjustable (${textContrast}:1)`;

  const accessibilityGrade: AIDesignAnalysisData['accessibilityGrade'] =
    textContrast >= 7.0 ? 'AAA' : textContrast >= 4.5 ? 'AA' : 'AA Large';

  const radiusMap: Record<LayoutVariationStyle, string> = {
    Modern: '12px',
    Minimal: '6px',
    Premium: '14px',
    Bold: '10px',
    Corporate: '8px',
  };

  const typographyMap: Record<LayoutVariationStyle, string> = {
    Modern: 'Plus Jakarta Sans',
    Minimal: 'Inter / Helvetica Neue',
    Premium: 'Cabinet Grotesk & Plus Jakarta Sans',
    Bold: 'Clash Display & Satoshi',
    Corporate: 'Public Sans & System Sans',
  };

  const styleName = `${variationStyle} ${websiteType}`;

  // Domain-specific rationale
  const whyColorsWork = `The anchor color (${colors.primary}) establishes strong brand recognition, while the background (${colors.background}) provides ${textContrast}:1 luminosity contrast against copy. Secondary (${colors.secondary}) and accent (${colors.accent}) divide structural cards and conversion CTA touchpoints without visual clutter.`;

  return {
    harmonyScore,
    contrastRating,
    accessibilityGrade,
    styleName,
    primaryUsage: 'Primary CTA buttons, brand badges, active navigation',
    secondaryUsage: 'Feature cards, sub-headers, secondary button borders',
    accentUsage: 'Interactive highlights, stats markers, conversion badges',
    recommendedRadius: radiusMap[variationStyle] || '12px',
    recommendedTypography: typographyMap[variationStyle] || 'Plus Jakarta Sans',
    whyColorsWork,
  };
}

/**
 * Generates component layout configuration depending on the selected style
 */
export function getLayoutComponentConfig(
  variationStyle: LayoutVariationStyle,
  _websiteType: WebsiteCategoryType
): LayoutComponentConfig {
  switch (variationStyle) {
    case 'Minimal':
      return {
        heroLayout: 'centered',
        cardElevation: 'flat',
        borderRadius: 'rounded-lg',
        spacingDensity: 'compact',
        navStyle: 'clean' as any,
        pricingStyle: 'two-column',
      };
    case 'Premium':
      return {
        heroLayout: 'split',
        cardElevation: 'glow-border',
        borderRadius: 'rounded-2xl',
        spacingDensity: 'relaxed',
        navStyle: 'floating',
        pricingStyle: 'highlight-middle',
      };
    case 'Bold':
      return {
        heroLayout: 'editorial',
        cardElevation: 'bordered',
        borderRadius: 'rounded-xl',
        spacingDensity: 'normal',
        navStyle: 'solid',
        pricingStyle: 'three-tier',
      };
    case 'Corporate':
      return {
        heroLayout: 'centered',
        cardElevation: 'bordered',
        borderRadius: 'rounded-lg',
        spacingDensity: 'compact',
        navStyle: 'bordered',
        pricingStyle: 'three-tier',
      };
    case 'Modern':
    default:
      return {
        heroLayout: 'split',
        cardElevation: 'subtle-shadow',
        borderRadius: 'rounded-xl',
        spacingDensity: 'normal',
        navStyle: 'floating',
        pricingStyle: 'highlight-middle',
      };
  }
}

/**
 * Generates realistic domain-authentic website content for all 12 categories
 */
export function getDefaultWebsiteContent(
  websiteType: WebsiteCategoryType,
  brandNameFallback: string = 'ColorForge'
): GeneratedWebsiteContent {
  const brand = brandNameFallback || 'Acme';

  switch (websiteType) {
    case 'SaaS':
      return {
        brandName: `${brand} Cloud`,
        tagline: 'Developer infrastructure & real-time analytics',
        heroBadge: 'Next-Gen Cloud Architecture',
        heroHeadline: 'Scale high-throughput systems without the operational friction.',
        heroSubheadline:
          'Unified telemetry, zero-latency caching, and automated autoscaling built directly for engineering teams shipping at speed.',
        primaryCta: 'Start Free Trial',
        secondaryCta: 'Explore Documentation',
        featuresTitle: 'Engineered for Mission-Critical Performance',
        featuresSubtitle: 'Everything you need to orchestrate distributed workflows effortlessly.',
        features: [
          {
            title: 'Sub-10ms Global Latency',
            desc: 'Distributed multi-region edge caches keep your application responsive across all continents.',
            icon: 'Zap',
            stat: '<10ms',
          },
          {
            title: 'Zero-Knowledge Cryptography',
            desc: 'End-to-end payload encryption with automatic TLS 1.3 certificate rotation.',
            icon: 'Shield',
            stat: '100% Encrypted',
          },
          {
            title: 'Instant Schema Synchronization',
            desc: 'Bi-directional live event streams keep databases, workers, and mobile clients aligned.',
            icon: 'Layers',
            stat: '99.999% SLA',
          },
        ],
        stats: [
          { label: 'Global Edge PoPs', value: '320+' },
          { label: 'Uptime Reliability', value: '99.999%' },
          { label: 'Events / Second', value: '4.8M' },
          { label: 'Enterprise Teams', value: '12,000+' },
        ],
        testimonials: [
          {
            quote: 'This platform reduced our operational overhead by 40% in our first month. The latency guarantees are real.',
            author: 'Marcus Vance',
            role: 'VP of Infrastructure',
            company: 'Stratos Health',
            rating: 5,
          },
          {
            quote: 'The API ergonomics and visual telemetry make debugging distributed microservices remarkably straightforward.',
            author: 'Elena Rostova',
            role: 'Lead Architect',
            company: 'Novus Financial',
            rating: 5,
          },
        ],
        pricingTiers: [
          {
            name: 'Starter Tier',
            price: '$29',
            period: 'mo',
            desc: 'Essential infrastructure for early-stage teams.',
            features: ['Up to 500k monthly requests', '10 edge regions', 'Community support', 'Basic telemetry logs'],
          },
          {
            name: 'Growth Scale',
            price: '$89',
            period: 'mo',
            desc: 'High-throughput capabilities for scaling SaaS.',
            features: ['Unlimited global requests', 'All 320+ edge regions', 'Priority 24/7 SLA', 'Custom domain certificates', 'Audit log retention'],
            popular: true,
          },
          {
            name: 'Enterprise Dedicated',
            price: '$299',
            period: 'mo',
            desc: 'Isolated VPC clusters and dedicated architect.',
            features: ['Custom VPC peering', 'Dedicated hardware clusters', 'Dedicated TAM', 'SOC2 Type II compliance report', 'Custom SLA agreements'],
          },
        ],
        faqs: [
          {
            question: 'How quickly can our team integrate the SDK?',
            answer: 'Most development teams go from `npm install` to production event telemetry in under 15 minutes with our zero-config clients.',
          },
          {
            question: 'Can we self-host or use private cloud VPCs?',
            answer: 'Yes, our Enterprise Dedicated plan supports AWS, GCP, and Azure private VPC deployments with air-gapped support.',
          },
        ],
      };

    case 'Portfolio':
      return {
        brandName: `${brand} Studio`,
        tagline: 'Senior Product Designer & Creative Technologist',
        heroBadge: 'Available for Q2 Projects',
        heroHeadline: 'Crafting memorable digital products and accessible design systems.',
        heroSubheadline:
          'Bridging strategic product design and clean front-end engineering to deliver high-converting web and mobile experiences.',
        primaryCta: 'View Selected Works',
        secondaryCta: 'Schedule Intro Call',
        featuresTitle: 'Core Capabilities & Discipline',
        featuresSubtitle: 'End-to-end design execution from initial discovery to production delivery.',
        features: [
          {
            title: 'Design Systems Architecture',
            desc: 'Scalable token structures, Figma component libraries, and synchronized code tokens.',
            icon: 'Palette',
          },
          {
            title: 'Full-Stack Prototyping',
            desc: 'High-fidelity interactive web prototypes built with React, TypeScript, and Tailwind.',
            icon: 'Code',
          },
          {
            title: 'Product Strategy & UX Research',
            desc: 'User testing, funnel conversion auditing, and quantitative design measurement.',
            icon: 'Compass',
          },
        ],
        stats: [
          { label: 'Years Experience', value: '8+' },
          { label: 'Products Launched', value: '45+' },
          { label: 'Design Awards', value: '14' },
          { label: 'Client Satisfaction', value: '100%' },
        ],
        testimonials: [
          {
            quote: 'A rare combination of exquisite visual taste and deep technical execution. Transformed our SaaS onboarding.',
            author: 'Julian Reed',
            role: 'Founder & CEO',
            company: 'Kinetix Labs',
            rating: 5,
          },
        ],
      };

    case 'Restaurant':
      return {
        brandName: `${brand} Bistro`,
        tagline: 'Artisanal seasonal dining & natural wines',
        heroBadge: 'Michelin Guide Selected 2026',
        heroHeadline: 'Thoughtfully crafted culinary moments from local, organic harvests.',
        heroSubheadline:
          'Experience a harmonious tasting menu curated daily, paired with natural biodynamic wines in an intimate contemporary atmosphere.',
        primaryCta: 'Reserve a Table',
        secondaryCta: 'Explore Seasonal Menu',
        featuresTitle: 'Our Culinary Philosophy',
        featuresSubtitle: 'Every ingredient is sourced within 60 miles of our kitchen.',
        features: [
          {
            title: 'Wood-Fired Hearth',
            desc: 'Locally cut oak and cherry woods infuse our vegetables and meats with gentle smoke.',
            icon: 'Flame',
          },
          {
            title: 'Biodynamic Wine Cellar',
            desc: 'Over 200 rare natural vintages chosen in direct partnership with independent growers.',
            icon: 'GlassWater',
          },
          {
            title: 'Handmade Pastas & Breads',
            desc: 'Stone-milled heritage grains slow-fermented for 36 hours for rich flavor and digestion.',
            icon: 'Utensils',
          },
        ],
        stats: [
          { label: 'Farm Partners', value: '18' },
          { label: 'Rare Wine Vintages', value: '240+' },
          { label: 'Seasonal Courses', value: '7' },
          { label: 'Years Serving', value: '12' },
        ],
      };

    case 'E-commerce':
      return {
        brandName: `${brand} Goods`,
        tagline: 'Premium everyday essentials engineered to last',
        heroBadge: 'New Spring Collection',
        heroHeadline: 'Minimalist craftsmanship for modern spaces and intentional living.',
        heroSubheadline:
          'Explore our curated collection of ceramics, sustainable apparel, and tactile home accents crafted by master artisans.',
        primaryCta: 'Shop New Arrivals',
        secondaryCta: 'View Bestsellers',
        featuresTitle: 'Built with Uncompromising Standards',
        featuresSubtitle: 'Conscious materials designed to endure generations, not seasons.',
        features: [
          {
            title: 'Carbon-Neutral Delivery',
            desc: 'Every shipment is 100% plastic-free and offset through verified reforestation partners.',
            icon: 'Truck',
          },
          {
            title: '10-Year Craft Guarantee',
            desc: 'Free repairs and hardware replacements for the lifetime of your product.',
            icon: 'ShieldCheck',
          },
          {
            title: 'Ethical Master Ateliers',
            desc: 'Handcrafted exclusively in certified, fair-wage family workshops in Portugal and Japan.',
            icon: 'Sparkles',
          },
        ],
        stats: [
          { label: 'Verified Reviews', value: '4.9 ★' },
          { label: 'Ethical Materials', value: '100%' },
          { label: 'Happy Customers', value: '85K+' },
          { label: 'Return Window', value: '45 Days' },
        ],
        pricingTiers: [
          {
            name: 'Essential Ceramic Set',
            price: '$120',
            period: 'pack',
            desc: '4 plates, 4 bowls crafted in stoneware.',
            features: ['Dishwasher safe', 'Matte glaze finish', 'Gift box included'],
          },
          {
            name: 'Complete Studio Collection',
            price: '$280',
            period: 'set',
            desc: 'Our full signature tableware suite.',
            features: ['12 dining pieces', 'Serving platter', 'Complimentary linen napkins', 'Free worldwide shipping'],
            popular: true,
          },
        ],
      };

    case 'Agency':
      return {
        brandName: `${brand} Creative`,
        tagline: 'Digital Strategy, Brand Identity & Web Engineering',
        heroBadge: 'Independent Studio',
        heroHeadline: 'We build digital identities that redefine competitive categories.',
        heroSubheadline:
          'Partnering with visionary founders and ambitious enterprises to engineer market-defining brands, interactive platforms, and design systems.',
        primaryCta: 'Start a Project',
        secondaryCta: 'View Client Case Studies',
        featuresTitle: 'Disciplined Creative Services',
        featuresSubtitle: 'Integrated expertise under one roof, with zero layers of account management.',
        features: [
          {
            title: 'Brand Identity & Systems',
            desc: 'Positioning, typographic strategy, logo suites, and comprehensive digital guidelines.',
            icon: 'Palette',
          },
          {
            title: 'Bespoke Web Development',
            desc: 'High-performance React/Next.js architectures, creative interactions, and headless CMS.',
            icon: 'Code2',
          },
          {
            title: 'Growth & Conversion Design',
            desc: 'Data-informed funnel optimization, landing page design, and measurable KPI improvements.',
            icon: 'BarChart',
          },
        ],
      };

    case 'Dashboard':
      return {
        brandName: `${brand} Analytics`,
        tagline: 'Enterprise Revenue & User Intelligence',
        heroBadge: 'Live Telemetry Active',
        heroHeadline: 'Real-time visibility across customer acquisition, retention, and MRR.',
        heroSubheadline:
          'Empower finance and product executives with single-source-of-truth business intelligence, automated anomaly detection, and cohort retention charts.',
        primaryCta: 'View Live Demo',
        secondaryCta: 'Connect Data Source',
        featuresTitle: 'Metric Command Center',
        featuresSubtitle: 'Configurable analytics widgets engineered for executive clarity.',
        features: [
          {
            title: 'Cohort Retention Graphs',
            desc: 'Track weekly and monthly user churn across subscription cohorts.',
            icon: 'LineChart',
          },
          {
            title: 'Automated Revenue Forecasts',
            desc: 'Predictive ARR projection models powered by historic trend regression.',
            icon: 'TrendingUp',
          },
          {
            title: 'Audit-Proof Financial Ledgers',
            desc: 'Automated invoice normalization and Stripe multi-currency reconciliation.',
            icon: 'Receipt',
          },
        ],
      };

    default:
      return {
        brandName: `${brand} Platform`,
        tagline: `Modern ${websiteType} digital experience`,
        heroBadge: `${websiteType} Precision Design`,
        heroHeadline: `Engineered specifically for exceptional ${websiteType} impact and trust.`,
        heroSubheadline:
          'Seamless hierarchy, accessible contrast, and high-performance interactive components designed for maximum user engagement.',
        primaryCta: 'Get Started Today',
        secondaryCta: 'Learn More',
        featuresTitle: `Why Choose ${brand}`,
        featuresSubtitle: `Purpose-built components tailored to the highest ${websiteType} standards.`,
        features: [
          {
            title: 'Reliable Performance',
            desc: 'Optimized render cycles and sub-millisecond execution for fluid responsiveness.',
            icon: 'Zap',
          },
          {
            title: 'Accessible By Design',
            desc: 'Strict adherence to WCAG contrast standards ensuring universal readability.',
            icon: 'ShieldCheck',
          },
          {
            title: 'Turnkey Integration',
            desc: 'Production-ready design tokens and React components ready for implementation.',
            icon: 'Layers',
          },
        ],
      };
  }
}

/**
 * Master generator function that builds a complete LayoutDesignSpec
 */
export function buildLayoutDesignSpec(
  websiteType: WebsiteCategoryType,
  colors: SelectedPaletteColors,
  variationStyle: LayoutVariationStyle = 'Modern',
  brandName?: string
): LayoutDesignSpec {
  const derived = deriveShadesFromPalette(colors);
  const analysis = generateAIDesignAnalysis(colors, websiteType, variationStyle);
  const layout = getLayoutComponentConfig(variationStyle, websiteType);
  const content = getDefaultWebsiteContent(websiteType, brandName);

  return {
    id: `layout_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    websiteType,
    variationStyle,
    colors,
    derived,
    analysis,
    layout,
    content,
    createdAt: new Date().toISOString(),
  };
}
