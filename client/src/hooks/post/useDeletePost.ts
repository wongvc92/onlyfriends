import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSetPostData } from "./useSetPostData";
import { deletePost, IDeletePostResponse } from "@/api/post/deletePost";

export const useDeletePost = () => {
  const { deletePostUserPage, deletePostHomePage } = useSetPostData();
  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onError: (error) => {
      toast.error(error.message || "Failed to delete post.");
    },
    onSuccess: async (data: IDeletePostResponse) => {
      toast.success(data.message);
      deletePostUserPage(data);
      deletePostHomePage(data);
    },
  });
};
