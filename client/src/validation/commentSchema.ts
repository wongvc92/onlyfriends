import { z } from "zod";

export const commentMaxLimit = 255;
export const commentSchema = z.object({
  id: z.number().optional(),
  comment: z.string().max(commentMaxLimit),
  post_id: z.number(),
});

export type TCommentSchema = z.infer<typeof commentSchema>;
