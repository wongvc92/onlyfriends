import apiClient from "@/utils/apiClient";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "../post/postKeys";
import { toast } from "sonner";
import { IPost } from "@/types/IPost";
import { useParams } from "@tanstack/react-router";
import { IGetAllPostsResponse } from "@/data/post/getAllPosts";
import { IGetPostsByUsernameResponse } from "@/data/post/getPostsByUsername";
import { createlikeSchema } from "@/validation/likeSchema";

interface ICreateLikeByPostIdResponse {
  postId: string;
}

export interface ICreateLikePayload {
  postId: string;
  author_id: string;
  content: string;
}

const createLikeByPostId = async ({ postId, author_id, content }: ICreateLikePayload): Promise<ICreateLikeByPostIdResponse> => {
  const parsed = createlikeSchema.safeParse({ params: { postId }, body: { author_id, content } });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }
  const url = `/api/likes/${parsed.data.params.postId}`;
  const res = await apiClient.post(url, { author_id: parsed.data.body.author_id, content: parsed.data.body.content });
  return res.data;
};

export const useCreateLike = () => {
  const { username } = useParams({ strict: false });
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLikeByPostId,
    onError: (error) => {
      console.log(`${error.message} - create like`);
      toast.error("Failed to like post or post doesn't exist");
    },
    onSuccess: (data: ICreateLikeByPostIdResponse) => {
      queryClient.setQueryData(postKeys.list(), (oldData: InfiniteData<IGetAllPostsResponse>) => {
        if (!oldData || !oldData.pages) return oldData;

        const newPages = oldData.pages.map((page) => {
          if (!page || !page.data) return page;

          return {
            ...page,
            data: page.data.map((post) => {
              if (post && post.id === data.postId) {
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

      queryClient.setQueryData(postKeys.detail(data.postId), (oldData: IPost) => {
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
                if (post && post.id === data.postId) {
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
