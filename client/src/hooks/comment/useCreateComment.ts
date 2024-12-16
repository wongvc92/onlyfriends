import apiClient from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "../post/postKeys";
import { commentKeys } from "./commentKeys";

const createComment = async ({ tagContent, postId }: { tagContent: string; postId: string }) => {
  const url = "/api/comments";
  const res = await apiClient.post(url, {
    comment: tagContent,
    post_id: postId,
  });
  return res.data;
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
    },
  });
};
