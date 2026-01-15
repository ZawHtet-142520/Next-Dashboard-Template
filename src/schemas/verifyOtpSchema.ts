import { z } from "zod";

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
