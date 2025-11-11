import { PersonalDetails } from "@/models/PersonalDetails";
import { FinancialDetails } from "@/models/FinancialDetails";


export interface CalculateRateRequest {
    productId: string;
    amount: number;
    termMonths: number;
    personalDetails: PersonalDetails;
    financialDetails: FinancialDetails;
  }