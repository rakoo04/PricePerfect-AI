export interface PricingTier {
  name: string;
  price: string;
  frequency: string;
  description: string;
  features: string[];
  highlighted: boolean;
  ctaText: string;
}

export interface AuditResult {
  brand: {
    colors: string[];
    fontVibe: string;
    brandVoice: string;
  };
  publicFeedback: {
    sentiment: 'positive' | 'neutral' | 'negative';
    simulatedReviews: string[];
    painPoints: string[];
  };
  competitorAnalysis: {
    comparisonSummary: string;
    pricePositioning: string;
    missingFeatures: string[];
  };
  croAudit: {
    score: number; // 0-100
    tacticsApplied: string[];
    missedOpportunities: string[];
  };
  heuristics: {
    usabilityScore: number; // 0-100
    findings: string[];
  };
  redesign: {
    reasoning: string;
    tiers: PricingTier[];
  };
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}