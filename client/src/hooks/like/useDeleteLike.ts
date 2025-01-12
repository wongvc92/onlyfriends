import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "../post/postKeys";
import { toast } from "sonner";
import apiClient from "@/utils/apiClient";
import { IPost } from "@/types/IPost";
import { useParams } from "@tanstack/react-router";
import { IGetAllPostsResponse } from "@/data/post/getAllPosts";
import { IGetPostsByUsernameResponse } from "@/data/post/getPostsByUsername";
import { deleteLikeSchema } from "@/validation/likeSchema";

interface IDeleteLikeByPostIdResponse {
  postId: string;
}

export interface IDeleteLikePayload {
  postId: string;
  author_id: string;
}

const dislikePost = async ({ postId, author_id }: IDeleteLikePayload) => {
  const parsed = deleteLikeSchema.safeParse({ params: { postId }, body: { author_id } });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }
  const url = `/api/likes/${parsed.data.params.postId}`;
  const res = await apiClient.delete(url, { data: { author_id: parsed.data.body.author_id } });
  return res.data;
};

export const useDeleteLike = () => {
  const { username } = useParams({ strict: false });
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dislikePost,
    onError: (error) => {
      console.log(`${error.message} - delete like`);
      toast.error("Failed to dislike post or post doesn't exist.");
    },
    onSuccess: (data: IDeleteLikeByPostIdResponse) => {
      queryClient.setQueryData(postKeys.list(), (oldData: InfiniteData<IGetAllPostsResponse>) => {
        // Safeguard against undefined oldData
        if (!oldData || !oldData.pages) return oldData;

        // Safeguard to ensure `pages` exists and is an array
        const newPages = oldData.pages.map((page) => {
          if (!page || !page.data) return page; // Ensure each page has data

          return {
            ...page,
            data: page.data.map((post) => {
              if (post && post.id === data.postId) {
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

      queryClient.setQueryData(postKeys.detail(data.postId), (oldData: IPost) => {
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
                if (post && post.id === data.postId) {
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
