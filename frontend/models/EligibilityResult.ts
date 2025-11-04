export interface EligibilityResult {
    eligible: boolean;
    riskCategory: 'low' | 'medium' | 'high';
    maxLoanAmount: number;
    recommendedTermMonths: number;
    reasons: string[];
  }
  