import { z } from "zod";

export const contentMaxLimit = 255;

export const postSchema = z.object({
  post: z.optional(z.string().max(contentMaxLimit)),
  images: z.optional(z.array(z.object({ url: z.string() }))),
});

export type TPostSchema = z.infer<typeof postSchema>;
