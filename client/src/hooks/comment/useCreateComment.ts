import apiClient from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";
import { IComment } from "@/types/IComment";
import { useSetCommentData } from "./useSetComentData";

export interface ICreateCommentResponse {
  comment: IComment;
  message: string;
}

const createComment = async ({ tagContent, postId }: { tagContent: string; postId: string }): Promise<ICreateCommentResponse> => {
  const url = "/api/comments";
  const res = await apiClient.post(url, {
    comment: tagContent,
    post_id: postId,
  });
  return res.data;
};

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
