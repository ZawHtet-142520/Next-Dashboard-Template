import { z } from "zod";

export const testEmailSchema = z.object({
  from: z.string().trim().min(1, "From is required").max(100, "Too long"),
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(200, "Subject too long (max 200 chars)"),
  body: z
    .string()
    .trim()
    .min(10, "Message too short (min 10 chars)")
    .max(5000, "Message too long (max 5000 chars)"),
});
export type TestEmailType = z.infer<typeof testEmailSchema>;
