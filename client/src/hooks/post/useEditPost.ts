import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/utils/apiClient";
import { IPost } from "@/types/IPost";
import { useSetPostData } from "./useSetPostData";

export interface IEditPostResponse {
  post: IPost;
  message: string;
}
const editPost = async ({ tagContent, postId }: { tagContent: string; postId: string }): Promise<IEditPostResponse> => {
  const url = `/api/posts/${postId}`;
  const res = await apiClient.put(url, { post: tagContent });
  return res.data;
};

export const useEditPost = () => {
  const { updatePostHomePage, updateSinglePost } = useSetPostData();
  return useMutation({
    mutationFn: editPost,
    onError: (error: any) => {
      if (error.errors) {
        toast.error(error.errors[0].message);
      } else if (error.message) {
        console.log(error.message);
        toast.error(error.message);
      } else {
        console.log(error.message);
        toast.error("Something went wrong. Please try again.");
      }
    },
    onSuccess: async (data: IEditPostResponse) => {
      toast.success("Successfully edited post.");
      updatePostHomePage(data);
      updateSinglePost(data);
    },
  });
};
