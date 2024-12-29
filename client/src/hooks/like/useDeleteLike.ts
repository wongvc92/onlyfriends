import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "../post/postKeys";
import { toast } from "sonner";
import apiClient from "@/utils/apiClient";
import { IPost } from "@/types/IPost";
import { useParams } from "@tanstack/react-router";
import { IGetAllPostsResponse } from "@/data/post/getAllPosts";
import { IGetPostsByUsernameResponse } from "@/data/post/getPostsByUsername";

const dislikePost = async (postId: string) => {
  const url = `/api/likes/${postId}`;
  const res = await apiClient.delete(url);
  return res.data;
};

export const useDeleteLike = ({ postId }: { postId: string }) => {
  const { username } = useParams({ strict: false });
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => dislikePost(postId),
    onError: (error) => toast.error(error.message || "Failed to dislike post."),
    onSuccess: () => {
      queryClient.setQueryData(postKeys.list(), (oldData: InfiniteData<IGetAllPostsResponse>) => {
        // Safeguard against undefined oldData
        if (!oldData || !oldData.pages) return oldData;

        // Safeguard to ensure `pages` exists and is an array
        const newPages = oldData.pages.map((page) => {
          if (!page || !page.data) return page; // Ensure each page has data

          return {
            ...page,
            data: page.data.map((post) => {
              if (post && post.id === postId) {
                const currentLikeCount = Number(post.like_count) || 0;
                return {
                  ...post,
                  is_liked: false, // Update liked state
                  like_count: currentLikeCount - 1, // Increment like count
                };
              }
              return post;
            }),
          };
        });

        // Return the updated data structure
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
        return { ...oldData, is_liked: false, like_count: Number(oldData.like_count) - 1 };
      });

      if (username) {
        queryClient.setQueryData(postKeys.userPosts(username as string), (oldData: InfiniteData<IGetPostsByUsernameResponse>) => {
          // Safeguard against undefined oldData
          if (!oldData || !oldData.pages) return oldData;

          // Safeguard to ensure `pages` exists and is an array
          const newPages = oldData.pages.map((page) => {
            if (!page || !page.data) return page; // Ensure each page has data

            return {
              ...page,
              data: page.data.map((post) => {
                if (post && post.id === postId) {
                  const currentLikeCount = Number(post.like_count) || 0;
                  return {
                    ...post,
                    is_liked: false, // Update liked state
                    like_count: currentLikeCount - 1, // Increment like count
                  };
                }
                return post;
              }),
            };
          });

          // Return the updated data structure
          return {
            ...oldData,
            pages: newPages,
          };
        });
      }
    },
  });
};
