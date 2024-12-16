import apiClient from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "./postKeys";
import { toast } from "sonner";

const createLikeByPostId = async (postId: string) => {
  const url = `/api/likes/${postId}`;
  const res = await apiClient.post(url);
  return res.data;
};

export const useCreateLike = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createLikeByPostId(postId),
    onError: (error) => toast.error(error.message || "Failed to like post"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.likes(postId) }),
  });
};
