import { z } from "zod";

export const createlikeSchema = z.object({
  params: z.object({ postId: z.string().min(1, { message: "Please provide post id" }).uuid({ message: "post id is not valid!" }) }),
  body: z.object({ author_id: z.string().uuid(), content: z.string() }),
});

export const deleteLikeSchema = z.object({
  params: z.object({ postId: z.string().min(1, { message: "Please provide post id" }).uuid({ message: "post id is not valid!" }) }),
  body: z.object({ author_id: z.string().uuid() }),
});
