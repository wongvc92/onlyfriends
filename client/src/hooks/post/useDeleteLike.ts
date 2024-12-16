import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "./postKeys";
import { toast } from "sonner";
import apiClient from "@/utils/apiClient";

const dislikePost = async (postId: string) => {
  const url = `/api/likes/${postId}`;
  const res = await apiClient.delete(url);
  return res.data;
};

export const useDeleteLike = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => dislikePost(postId),
    onError: (error) => toast.error(error.message || "Failed to dislike post."),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.likes(postId) }),
  });
};
