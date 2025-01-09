import { z } from "zod";

export const likeSchema = z.object({
  params: z.object({ postId: z.string().min(1, { message: "Please provide post id" }).uuid({ message: "post id is not valid!" }) }),
});
