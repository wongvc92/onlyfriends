import { z } from "zod";
import { allowedImageDomains } from "../lib/constant";

export const profileSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().max(255).optional().nullable(),
  bio: z.string().max(255, { message: "Bio must contain at most 255 character(s)" }).optional().nullable(),
  banner_image: z
    .string()
    // .url()
    // .refine(
    //   (url) => {
    //     try {
    //       const parsedUrl = new URL(url);
    //       return allowedImageDomains.includes(parsedUrl.hostname);
    //     } catch {
    //       return false;
    //     }
    //   },
    //   { message: "Image URL must be from an allowed domain" }
    // )
    .catch(""),
  display_image: z
    .string()
    // .url()
    // .refine(
    //   (url) => {
    //     try {
    //       const parsedUrl = new URL(url);
    //       return allowedImageDomains.includes(parsedUrl.hostname);
    //     } catch {
    //       return false;
    //     }
    //   },
    //   { message: "Image URL must be from an allowed domain" }
    // )
    .catch(""),
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
