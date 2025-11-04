import { EligibilityResult } from "@/models/EligibilityResult";
import { RecommendedLoan } from "@/models/RecommendedLoan";
import { AffordabilityMetrics } from "@/models/AffordabilityMatrix";

export interface EligibilityResponse {
    eligibilityResult: EligibilityResult;
    recommendedLoan: RecommendedLoan | null;
    affordabilityAnalysis: AffordabilityMetrics;
  }
  