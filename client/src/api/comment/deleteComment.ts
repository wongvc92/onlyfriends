import apiClient from "@/utils/apiClient";
import { deleteCommentSchema } from "@/validation/commentSchema";

export const deleteComment = async ({ commentId }: { commentId: string }) => {
    const parsed = deleteCommentSchema.safeParse({ commentId });
    if (!parsed.success) {
      throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
    }
  
    const url = `/api/comments/${parsed.data.commentId}`;
    const res = await apiClient.delete(url);
    return res.data;
  };