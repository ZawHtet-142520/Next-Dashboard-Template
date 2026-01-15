import { z } from "zod";

export const forgetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>;
