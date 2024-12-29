import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { postKeys } from "./postKeys";
import apiClient from "@/utils/apiClient";
import { IGetAllPostsResponse } from "@/data/post/getAllPosts";
import { IPost } from "@/types/IPost";

interface IEditPostResponse {
  post: IPost;
  message: string;
}
const editPost = async ({ tagContent, postId }: { tagContent: string; postId: string }): Promise<IEditPostResponse> => {
  const url = `/api/posts/${postId}`;
  const res = await apiClient.put(url, { post: tagContent });
  return res.data;
};

export const useEditPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editPost,
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
    onSuccess: async (data: IEditPostResponse) => {
      toast.success("Successfully edited post.");

      queryClient.setQueryData(postKeys.list(), (oldData: InfiniteData<IGetAllPostsResponse> | undefined) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page) => {
          if (!page || !page.data) return page;

          return {
            ...page,
            data: page.data.map((post) => {
              if (post && post.id === data.post.id) {
                return data.post;
              }
              return post;
            }),
          };
        });

        return {
          ...oldData,
          pages: newPages,
        };
      });

      queryClient.setQueryData(postKeys.detail(data.post.id), (oldData: IPost | undefined) => {
        if (!oldData) {
          return data.post;
        }
        return data.post;
      });
    },
  });
};
