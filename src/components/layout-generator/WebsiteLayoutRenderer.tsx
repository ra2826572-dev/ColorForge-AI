import React from 'react';
import { GeneratedLayoutSystem } from '../../types/colorforge';
import { SaaSPreview } from './preview-templates/SaaSPreview';
import { PortfolioPreview } from './preview-templates/PortfolioPreview';
import { AgencyPreview } from './preview-templates/AgencyPreview';
import { EcommercePreview } from './preview-templates/EcommercePreview';
import { RestaurantPreview } from './preview-templates/RestaurantPreview';
import { BlogPreview } from './preview-templates/BlogPreview';
import { DashboardPreview } from './preview-templates/DashboardPreview';
import { HealthcarePreview } from './preview-templates/HealthcarePreview';
import { RealEstatePreview } from './preview-templates/RealEstatePreview';
import { FinancePreview } from './preview-templates/FinancePreview';
import { EducationPreview } from './preview-templates/EducationPreview';
import { LandingPagePreview } from './preview-templates/LandingPagePreview';

interface WebsiteLayoutRendererProps {
  system: GeneratedLayoutSystem;
  fontFamily: string;
}

export const WebsiteLayoutRenderer: React.FC<WebsiteLayoutRendererProps> = ({
  system,
  fontFamily,
}) => {
  switch (system.websiteType) {
    case 'SaaS':
      return <SaaSPreview system={system} fontFamily={fontFamily} />;
    case 'Portfolio':
      return <PortfolioPreview system={system} fontFamily={fontFamily} />;
    case 'Agency':
      return <AgencyPreview system={system} fontFamily={fontFamily} />;
    case 'E-commerce':
      return <EcommercePreview system={system} fontFamily={fontFamily} />;
    case 'Restaurant':
      return <RestaurantPreview system={system} fontFamily={fontFamily} />;
    case 'Blog':
      return <BlogPreview system={system} fontFamily={fontFamily} />;
    case 'Dashboard':
      return <DashboardPreview system={system} fontFamily={fontFamily} />;
    case 'Healthcare':
      return <HealthcarePreview system={system} fontFamily={fontFamily} />;
    case 'Real Estate':
      return <RealEstatePreview system={system} fontFamily={fontFamily} />;
    case 'Finance':
      return <FinancePreview system={system} fontFamily={fontFamily} />;
    case 'Education':
      return <EducationPreview system={system} fontFamily={fontFamily} />;
    case 'Landing Page':
    default:
      return <LandingPagePreview system={system} fontFamily={fontFamily} />;
  }
};
