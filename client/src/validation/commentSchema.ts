import { z } from "zod";

export const commentSchema = z.object({
  id: z.number().optional(),
  comment: z.string().max(255),
  post_id: z.number(),
});

export type TCommentSchema = z.infer<typeof commentSchema>;
