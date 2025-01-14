import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "../post/postKeys";
import { IPost } from "@/types/IPost";
import { IGetAllPostsResponse } from "@/api/post/getAllPosts";
import { IGetPostsByUsernameResponse } from "@/api/post/getPostsByUsername";

export const useSetLikeData = () => {
  const queryClient = useQueryClient();

  const updateHomePageLikeCount = (postId: string, is_liked: boolean, quantity: number) => {
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
                is_liked,
                like_count: currentLikeCount + quantity,
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
  };

  const updateSinglePostLike = (postId: string, is_liked: boolean, quantity: number) => {
    queryClient.setQueryData(postKeys.detail(postId), (oldData: IPost) => {
      if (!oldData) {
        console.warn("Old data for post detail is undefined. Skipping update.");
        return oldData; // Safeguard for undefined oldData
      }
      const currentLikeCount = Number(oldData.like_count) || 0;
      return { ...oldData, is_liked, like_count: currentLikeCount + quantity } as IPost;
    });
  };

  const updateUserPostLike = (postId: string, is_liked: boolean, quantity: number, username: String) => {
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
                is_liked,
                like_count: currentLikeCount + quantity,
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
  };
  return { updateHomePageLikeCount, updateSinglePostLike, updateUserPostLike };
};
