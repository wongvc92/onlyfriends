import apiClient from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { postKeys } from "./postKeys";

interface DeletePostResponse {
  message: string;
}
const deletePost = async (postId: string): Promise<DeletePostResponse> => {
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
    onSuccess: async (data: DeletePostResponse) => {
      toast.success(data.message);
      await queryClient.invalidateQueries({
        queryKey: postKeys.all,
      });
    },
  });
};
