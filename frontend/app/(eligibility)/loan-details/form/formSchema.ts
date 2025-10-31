import { z } from "zod";

export const loanDetailsFormSchema = z.object({
  loanAmount: z
    .number({ message: "Loan amount is required" })
    .min(1000, { message: "Loan amount must be at least $1,000" })
    .max(10000000, { message: "Loan amount cannot exceed $10,000,000" }),
  loanTerm: z
    .number({ message: "Loan term is required" })
    .min(1, { message: "Loan term must be at least 1 month" })
    .max(360, { message: "Loan term cannot exceed 360 months (30 years)" }),
  loanPurpose: z.string().min(1, { message: "Loan purpose is required" }),
});
