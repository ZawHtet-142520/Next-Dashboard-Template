import { z } from "zod";

export const updateNotificationTemplateSchema = z.object({
  _id: z.string(),
  subject: z
    .string({ required_error: "Subject is required" })
    .trim()
    .min(1, "Subject is required"),
  template: z
    .string({ required_error: "Template is required" })
    .trim()
    .min(1, "Template is required"),
  variables: z.array(z.string()),
});

export type UpdateNotificationTemplateType = z.infer<
  typeof updateNotificationTemplateSchema
>;
