import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { commentKeys } from "./commentKeys";
import apiClient from "@/utils/apiClient";
import { deleteCommentSchema } from "@/validation/commentSchema";
import { useSetCommentData } from "./useSetComentData";

const deleteComment = async ({ commentId }: { commentId: string }) => {
  const parsed = deleteCommentSchema.safeParse({ commentId });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }

  const url = `/api/comments/${parsed.data.commentId}`;
  const res = await apiClient.delete(url);
  return res.data;
};

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();
  const { updateHomePageCommentCount, updateSinglePostCommentCount } = useSetCommentData();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      toast.success("comment deleted");
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
      updateHomePageCommentCount(postId, -1);
      updateSinglePostCommentCount(postId, -1);
    },
  });
};
