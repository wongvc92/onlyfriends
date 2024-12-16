import apiClient from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { postKeys } from "./postKeys";

const deletePost = async (postId: string) => {
  const url = `/api/posts/${postId}`;
  const res = await apiClient.delete(url);
  return res.data;
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onError: (error) => {
      toast.error(error.message || "Failed to delete post.");
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({
        queryKey: postKeys.all,
      });
    },
  });
};
