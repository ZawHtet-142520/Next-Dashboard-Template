import { z } from "zod";

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
