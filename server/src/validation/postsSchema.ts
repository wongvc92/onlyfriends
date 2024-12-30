import { z } from "zod";

export const contentMaxLimit = 255;

export const postSchema = z.object({
  post: z.coerce.string().max(contentMaxLimit),
  images: z.optional(z.array(z.object({ url: z.string().max(255) })).max(10, { message: "Only max 10 images allowed" })),
});

export type TPostSchema = z.infer<typeof postSchema>;
