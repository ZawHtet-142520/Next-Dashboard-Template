import { z } from "zod";

export const createWebsiteSchama = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^(?:\+?95|0)?9\d{7,10}$/, "Invalid Myanmar phone format"),
  logo: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max 5MB")
    .refine((file) => file.type.startsWith("image/"), "Must be an image")
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
          file.type,
        ),
      "Only JPEG, PNG, WebP, or GIF allowed",
    )
    .optional(),
  url: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Must be a valid URL",
    }),
  subject: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .refine((val) => !val || val.length >= 1, {
      message: "Subject cannot be empty",
    }),
  organization: z.string(),
});

export type CreateWebsiteType = z.infer<typeof createWebsiteSchama>;
