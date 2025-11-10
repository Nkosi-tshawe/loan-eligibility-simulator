import { PersonalDetails } from "@/models/PersonalDetails";
import { FinancialDetails } from "@/models/FinancialDetails";
import { LoanDetails } from "@/models/LoanDetails";

export interface EligibilityRequest {
    personalDetails: PersonalDetails;
    financialDetails: FinancialDetails;
    loanDetails: LoanDetails;
  }     