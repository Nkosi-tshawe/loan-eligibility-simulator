import { z } from "zod";

export const financialDetailsFormSchema = z.object({
  monthlyIncome: z
    .number({ message: "Monthly income is required" })
    .min(0, { message: "Monthly income cannot be negative" })
    .positive({ message: "Monthly income must be greater than 0" }),
  monthlyExpenses: z
    .number({ message: "Monthly expenses is required" })
    .min(0, { message: "Monthly expenses cannot be negative" })
    .positive({ message: "Monthly expenses must be greater than 0" }),
  existingDebt: z
    .number({ message: "Existing debt is required" })
    .min(0, { message: "Existing debt cannot be negative" }),
  creditScore: z
    .number({ message: "Credit score is required" })
    .min(300, { message: "Credit score must be at least 300" })
    .max(850, { message: "Credit score cannot exceed 850" }),
});
