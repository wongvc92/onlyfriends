import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { commentKeys } from "./commentKeys";
import { useSetCommentData } from "./useSetComentData";
import { deleteComment } from "@/api/comment/deleteComment";

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
