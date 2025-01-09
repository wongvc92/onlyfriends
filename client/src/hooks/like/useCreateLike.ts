import apiClient from "@/utils/apiClient";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "../post/postKeys";
import { toast } from "sonner";
import { IPost } from "@/types/IPost";
import { useParams } from "@tanstack/react-router";
import { IGetAllPostsResponse } from "@/data/post/getAllPosts";
import { IGetPostsByUsernameResponse } from "@/data/post/getPostsByUsername";
import { likeSchema } from "@/validation/likeSchema";

const createLikeByPostId = async (postId: string) => {
  const parsed = likeSchema.safeParse({ postId });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }
  const url = `/api/likes/${parsed.data.postId}`;
  const res = await apiClient.post(url);
  return res.data;
};

export const useCreateLike = ({ postId }: { postId: string }) => {
  const { username } = useParams({ strict: false });
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createLikeByPostId(postId),
    onError: (error) => toast.error(error.message || "Failed to like post"),
    onSuccess: () => {
      queryClient.setQueryData(postKeys.list(), (oldData: InfiniteData<IGetAllPostsResponse>) => {
        if (!oldData || !oldData.pages) return oldData;

        const newPages = oldData.pages.map((page) => {
          if (!page || !page.data) return page;

          return {
            ...page,
            data: page.data.map((post) => {
              if (post && post.id === postId) {
                // Safeguard for undefined posts
                const currentLikeCount = Number(post.like_count) || 0;
                return {
                  ...post,
                  is_liked: true,
                  like_count: currentLikeCount + 1,
                };
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

      queryClient.setQueryData(postKeys.detail(postId), (oldData: IPost) => {
        if (!oldData) {
          console.warn("Old data for post detail is undefined. Skipping update.");
          return oldData; // Safeguard for undefined oldData
        }
        const currentLikeCount = Number(oldData.like_count) || 0;
        return { ...oldData, is_liked: true, like_count: currentLikeCount + 1 } as IPost;
      });

      if (username) {
        queryClient.setQueryData(postKeys.userPosts(username as string), (oldData: InfiniteData<IGetPostsByUsernameResponse>) => {
          if (!oldData || !oldData.pages) return oldData;

          const newPages = oldData.pages.map((page) => {
            if (!page || !page.data) return page;

            return {
              ...page,
              data: page.data.map((post) => {
                if (post && post.id === postId) {
                  const currentLikeCount = Number(post.like_count) || 0;
                  return {
                    ...post,
                    is_liked: true,
                    like_count: currentLikeCount + 1,
                  };
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
      }
    },
  });
};
