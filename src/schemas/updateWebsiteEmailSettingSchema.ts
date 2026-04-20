import { z } from "zod";

export const updateWebsiteEmailSettingSchema = z.object({
  host: z.string().trim().min(1, "Host is required"),
  port: z.number().int().min(1).max(65535, "Invalid port number"),
  secure: z.boolean(),
  authUser: z.string().trim().email("Invalid email format for authUser"),
  authPass: z.string().trim().min(1, "Password is required"),
});

export type UpdateWebsiteEmailSettingType = z.infer<
  typeof updateWebsiteEmailSettingSchema
>;
