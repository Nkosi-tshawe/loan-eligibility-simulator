import { z } from "zod";

export const personalDetailsFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  age: z
    .number({ message: "Age is required" })
    .min(18, { message: "Age must be at least 18" })
    .max(100, { message: "Age must be less than 100" }),
  employmentStatus: z.string().min(1, { message: "Employment status is required" }),
  employmentDuration: z
    .number({ message: "Employment duration is required" })
    .min(0, { message: "Employment duration cannot be negative" }),
});
