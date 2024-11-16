import { z } from "zod";

export const contentMaxLimit = 255;

export const postSchema = z.object({
  post: z.string().max(contentMaxLimit),
  images: z.optional(z.array(z.object({ url: z.string().max(255) }))),
});

export type TPostSchema = z.infer<typeof postSchema>;
