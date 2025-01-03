import { basePath } from "@/utils/basePath";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IComment } from "@/types/IComment";
import { postKeys } from "../post/postKeys";
import { commentKeys } from "./commentKeys";
import { IGetAllPostsResponse } from "@/data/post/getAllPosts";
import { IPost } from "@/types/IPost";
import apiClient from "@/utils/apiClient";
import { IGetCommentsByPostIdResponse } from "@/data/comment/getCommentsByPostId";

const deleteComment = async ({ commentId }: { commentId: string }) => {
  const url = `/api/comments/${commentId}`;
  const res = await apiClient.delete(url);
  return res.data;
};

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      toast.success("comment deleted");

      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });

      queryClient.setQueryData(postKeys.list(), (oldData: InfiniteData<IGetAllPostsResponse>) => {
        if (!oldData || !oldData.pages) return oldData;

        const newPages = oldData.pages.map((page) => {
          if (!page || !page.data) return page;

          return {
            ...page,
            data: page.data.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  comment_count: Number(post.comment_count) - 1,
                } as IPost;
              }
            }),
          };
        });

        return {
          ...oldData,
          pageParams: oldData.pageParams,
          pages: newPages,
        } as InfiniteData<IGetAllPostsResponse>;
      });

      queryClient.setQueryData(postKeys.detail(postId), (oldData: IPost) => {
        if (!oldData) {
          console.warn("Old data for comment is undefined. Skipping update.");
          return oldData; // Safeguard for undefined oldData
        }
        return {
          ...oldData,
          comment_count: Number(oldData.comment_count) - 1,
        } as IPost;
      });
    },
  });
};
