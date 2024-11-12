import { z } from "zod";

export const contentMaxLimit = 255;

export const postSchema = z.object({
  post: z.string().max(contentMaxLimit),
});

export type TPostSchema = z.infer<typeof postSchema>;
