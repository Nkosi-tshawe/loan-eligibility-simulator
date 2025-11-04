import { LoanProduct } from "@/models/LoanProduct";

export interface RecommendedLoan {
    product: LoanProduct;
    amount: number;
    termMonths: number;
    interestRate: number;
  }