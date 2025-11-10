import { PaymentSchedule } from "@/models/PaymentSchedule";

export interface CalculateRateResponse {
    interestRate: number;
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    schedule: PaymentSchedule[];
  }