import { z } from "zod";

export const postSchema = z.object({
  post: z.string().max(300),
});

export type TPostSchema = z.infer<typeof postSchema>;
