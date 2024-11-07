import { z } from "zod";
import { allowedImageDomains } from "../lib/constant";

export const profileSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().max(255).optional().nullable(),
  bio: z.string().max(255).optional().nullable(),
  banner_image: z
    .string()
    .url()
    .max(255)
    .refine(
      (url) => {
        try {
          const parsedUrl = new URL(url);
          return allowedImageDomains.includes(parsedUrl.hostname);
        } catch {
          return false;
        }
      },
      { message: "Image URL must be from an allowed domain" }
    ),
  display_image: z
    .string()
    .url()
    .max(255)
    .refine(
      (url) => {
        try {
          const parsedUrl = new URL(url);
          return allowedImageDomains.includes(parsedUrl.hostname);
        } catch {
          return false;
        }
      },
      { message: "Image URL must be from an allowed domain" }
    ),
  location: z.string().max(255).optional().nullable(),
  website: z
    .string()
    .url()
    .max(255)
    .optional()
    .nullable()
    .refine((value) => !value || value.startsWith("https://"), { message: "website must start with https://" }),
  created_at: z
    .date()
    .default(() => new Date())
    .optional(),
  updated_at: z
    .date()
    .default(() => new Date())
    .optional(),
});

export type TProfileSchema = z.infer<typeof profileSchema>;
