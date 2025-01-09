import { z } from "zod";

export const commentMaxLimit = 255;
export const createCommentSchema = z.object({
  comment: z.string().max(commentMaxLimit),
  post_id: z.string().min(1).uuid(),
});

export type TCreateCommentSchema = z.infer<typeof createCommentSchema>;

export const editCommentSchema = z.object({
  comment: z.string().uuid(),
});

export type TEditCommentSchema = z.infer<typeof editCommentSchema>;

export const deleteCommentSchema = z.object({
  commentId: z.string().uuid(),
});

export type TDeleteCommentSchema = z.infer<typeof editCommentSchema>;

export const getCommentsByPostIdSchema = z.object({
  params: z.object({
    postId: z.string().uuid(),
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).default(10),
  }),
});

export type TGetCommentsByPostIdSchema = z.infer<typeof getCommentsByPostIdSchema>;
