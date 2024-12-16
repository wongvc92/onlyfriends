import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IComment } from "@/types/IComment";
import { toast } from "sonner";
import { commentKeys } from "./commentKeys";
import apiClient from "@/utils/apiClient";
import { postKeys } from "../post/postKeys";

const editComment = async ({ tagContent, comment }: { tagContent: string; comment: IComment }) => {
  const url = `/api/comments/${comment.id}`;
  const res = await apiClient.put(url, {
    comment: tagContent,
    post_id: comment.post_id,
  });

  return res.data;
};

export const useEditComment = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { tagContent: string; comment: IComment }) => editComment(data),
    onSuccess: () => {
      toast.success("Comment edited.");
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(postId),
      });
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(postId),
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to edit comment");
    },
  });
};
