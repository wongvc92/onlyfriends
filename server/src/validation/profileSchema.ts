import { z } from "zod";

export const profileSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().max(255).optional().nullable(),
  bio: z.string().max(255).optional().nullable(),
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
