import { z } from "zod";

export const personalDetailsFormSchema = z.object({
  age: z
    .number({ message: "Age is required" })
    .min(18, { message: "Age must be at least 18" })
    .max(100, { message: "Age must be less than 100" }),
  employmentStatus: z.string().min(1, { message: "Employment status is required" }),
  yearsInCurrentRole: z
    .number({ message: "Employment duration is required" })
    .min(1, { message: "Employment duration cannot be negative" }),
});
