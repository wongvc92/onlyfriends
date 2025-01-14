import apiClient from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deletePostSchema } from "@/validation/postsSchema";
import { useSetPostData } from "./useSetPostData";
import { IPost } from "@/types/IPost";

export interface IDeletePostResponse {
  message: string;
  post: IPost;
}
const deletePost = async (postId: string): Promise<IDeletePostResponse> => {
  const parsed = deletePostSchema.safeParse({ postId });

  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }

  const url = `/api/posts/${parsed.data.postId}`;
  const res = await apiClient.delete(url);
  return res.data;
};

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
