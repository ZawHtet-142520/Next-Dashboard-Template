import { z } from "zod";

export const updateEmailSettingSchema = z.object({
  host: z.string().trim().min(1, "Host is required"),
  port: z.number().int().min(1).max(65535, "Invalid port number"),
  secure: z.boolean(),
  authUser: z.string().trim().email("Invalid email format"),
  authPass: z.string().trim().min(1, "Password is required"),
  from: z.string().trim().min(1, "From is required"),
  email: z.string().toLowerCase().email("Invalid email format"),
});

export type updateEmailSettingType = z.infer<typeof updateEmailSettingSchema>;
