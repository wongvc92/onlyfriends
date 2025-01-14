import { useMutation } from "@tanstack/react-query";
import { useSetCommentData } from "./useSetComentData";
import { createComment } from "@/api/comment/createComment";

export const useCreateComment = (postId: string) => {
  const { createNewComment, updateHomePageCommentCount, updateSinglePostCommentCount } = useSetCommentData();
  return useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      createNewComment(data, postId);
      updateHomePageCommentCount(postId, +1);
      updateSinglePostCommentCount(postId, +1);
    },
  });
};
