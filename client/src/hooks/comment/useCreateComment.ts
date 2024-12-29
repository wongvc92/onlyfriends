import apiClient from "@/utils/apiClient";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "../post/postKeys";
import { commentKeys } from "./commentKeys";
import { IGetCommentsByPostIdResponse } from "@/data/comment/getCommentsByPostId";
import { IComment } from "@/types/IComment";
import { IPost } from "@/types/IPost";
import { IGetAllPostsResponse } from "@/data/post/getAllPosts";

interface ICreateCommentResponse {
  comment: IComment;
  message: string;
}

const createComment = async ({ tagContent, postId }: { tagContent: string; postId: string }): Promise<ICreateCommentResponse> => {
  const url = "/api/comments";
  const res = await apiClient.post(url, {
    comment: tagContent,
    post_id: postId,
  });
  return res.data;
};

export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: (data: ICreateCommentResponse) => {
      queryClient.setQueryData(postKeys.list(), (oldData: InfiniteData<IGetAllPostsResponse>) => {
        if (!oldData || !oldData.pages) return oldData;

        const newPages = oldData.pages.map((page) => {
          if (!page || !page.data) return page;

          return {
            ...page,
            data: page.data.map((post: IPost) => {
              if (post && post.id === postId) {
                return {
                  ...post,
                  comment_count: Number(post.comment_count) + 1,
                } as IPost;
              }
              return post;
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
        const newCommentCount = Number(oldData.comment_count) + 1;
        return { ...oldData, comment_count: newCommentCount } as IPost;
      });

      queryClient.setQueryData(commentKeys.list(postId), (oldData: InfiniteData<IGetCommentsByPostIdResponse> | undefined) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page, index) => {
          if (!page || !page.data) return page;

          // Add the new comment only to the first page
          if (index === 0) {
            return {
              ...page,
              data: [data.comment, ...page.data],
              totalComments: page.totalComments + 1, // Increment totalComments
            };
          }

          return page; // Leave other pages unchanged
        });

        return {
          ...oldData,
          pages: newPages,
          pageParams: oldData.pageParams,
        } as InfiniteData<IGetCommentsByPostIdResponse>;
      });
    },
  });
};
