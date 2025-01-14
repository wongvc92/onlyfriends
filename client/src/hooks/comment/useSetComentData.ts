import { IGetAllPostsResponse } from "@/data/post/getAllPosts";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "../post/postKeys";
import { IPost } from "@/types/IPost";
import { IGetCommentsByPostIdResponse } from "@/data/comment/getCommentsByPostId";
import { commentKeys } from "./commentKeys";
import { ICreateCommentResponse } from "./useCreateComment";
import { IEditCommentResponse } from "./useEditComment";

export const useSetCommentData = () => {
  const queryClient = useQueryClient();

  const updateHomePageCommentCount = (postId: string, quantity: number) => {
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
                comment_count: Number(post.comment_count) + quantity,
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
  };

  const updateSinglePostCommentCount = (postId: string, quantity: number) => {
    queryClient.setQueryData(postKeys.detail(postId), (oldData: IPost) => {
      const newCommentCount = Number(oldData.comment_count) + quantity;
      return { ...oldData, comment_count: newCommentCount } as IPost;
    });
  };

  const updateSinglePostComment = (data: IEditCommentResponse) => {
    queryClient.setQueryData(commentKeys.list(data.comment.post_id), (oldData: InfiniteData<IGetCommentsByPostIdResponse> | undefined) => {
      if (!oldData) return oldData;

      const newPages = oldData.pages.map((page) => {
        if (!page || !page.data) return page;

        return {
          ...page,
          data: page.data.map((comment) => {
            if (comment.id === data.comment.id) {
              return data.comment;
            }
            return comment;
          }),
        };
      });

      return {
        ...oldData,
        pages: newPages,
      };
    });
  };

  const createNewComment = (data: ICreateCommentResponse, postId: string) => {
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
  };
  return { updateHomePageCommentCount, updateSinglePostCommentCount, createNewComment, updateSinglePostComment };
};
