import { IGetPostsByUsernameResponse } from "@/data/post/getPostsByUsername";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "./postKeys";
import { ICreatePostResponse } from "./useCreatePost";
import { IGetAllPostsResponse } from "@/data/post/getAllPosts";
import { IEditPostResponse } from "./useEditPost";
import { IPost } from "@/types/IPost";
import { IDeletePostResponse } from "./useDeletePost";

export const useSetPostData = () => {
  const queryClient = useQueryClient();

  const createPostUserPage = (data: ICreatePostResponse) => {
    queryClient.setQueryData(postKeys.userPosts(data.post.username), (oldData: InfiniteData<IGetPostsByUsernameResponse> | undefined) => {
      if (!oldData) return oldData;

      const newPages = oldData.pages.map((page, index) => {
        if (!page || !page.data) return page;

        // Add the new comment only to the first page
        if (index === 0) {
          return {
            ...page,
            data: [data.post, ...page.data],
          };
        }

        return page; // Leave other pages unchanged
      });

      return {
        ...oldData,
        pages: newPages,
        pageParams: oldData.pageParams,
      } as InfiniteData<IGetPostsByUsernameResponse>;
    });
  };

  const createPostHomePage = (data: ICreatePostResponse) => {
    queryClient.setQueryData(postKeys.list(), (oldData: InfiniteData<IGetAllPostsResponse> | undefined) => {
      if (!oldData) return oldData;

      const newPages = oldData.pages.map((page, index) => {
        if (!page || !page.data) return page;

        // Add the new comment only to the first page
        if (index === 0) {
          return {
            ...page,
            data: [data.post, ...page.data],
          };
        }

        return page; // Leave other pages unchanged
      });

      return {
        ...oldData,
        pages: newPages,
        pageParams: oldData.pageParams,
      } as InfiniteData<IGetAllPostsResponse>;
    });
  };

  const deletePostHomePage = (data: IDeletePostResponse) => {
    queryClient.setQueryData(postKeys.list(), (oldData: InfiniteData<IGetAllPostsResponse> | undefined) => {
      if (!oldData) return oldData;

      const newPages = oldData.pages.map((page) => {
        if (!page || !page.data) return page;

        return { ...page, data: page.data.filter((post) => post.id !== data.post.id) };
      });

      return {
        ...oldData,
        pages: newPages,
        pageParams: oldData.pageParams,
      } as InfiniteData<IGetAllPostsResponse>;
    });
  };

  const deletePostUserPage = (data: IDeletePostResponse) => {
    queryClient.setQueryData(postKeys.userPosts(data.post.username), (oldData: InfiniteData<IGetPostsByUsernameResponse> | undefined) => {
      if (!oldData) return oldData;

      const newPages = oldData.pages.map((page) => {
        if (!page || !page.data) return page;

        return { ...page, data: page.data.filter((post) => post.id !== data.post.id) };
      });

      return {
        ...oldData,
        pages: newPages,
        pageParams: oldData.pageParams,
      } as InfiniteData<IGetPostsByUsernameResponse>;
    });
  };

  const updatePostHomePage = (data: IEditPostResponse) => {
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
  };

  const updateSinglePost = (data: IEditPostResponse) => {
    queryClient.setQueryData(postKeys.detail(data.post.id), (oldData: IPost | undefined) => {
      if (!oldData) {
        return data.post;
      }
      return data.post;
    });
  };
  return { createPostUserPage, createPostHomePage, updatePostHomePage, updateSinglePost, deletePostUserPage, deletePostHomePage };
};
