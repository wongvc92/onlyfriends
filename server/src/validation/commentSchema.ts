import { z } from "zod";

export const commentMaxLimit = 255;
export const commentSchema = z.object({
  id: z.string().uuid().optional(),
  comment: z.string().max(commentMaxLimit),
  post_id: z.string().min(1).uuid(),
});

export type TCommentSchema = z.infer<typeof commentSchema>;
