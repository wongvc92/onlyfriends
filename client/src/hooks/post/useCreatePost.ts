import { urlToFile } from "@/lib/cropImage";
import { useImageUploadManager } from "../common/useImageUploadManager";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/utils/apiClient";
import { postKeys } from "./postKeys";
import { useAuth } from "@/context/auth";
import { IGetAllPostsResponse } from "@/data/post/getAllPosts";
import { IPost } from "@/types/IPost";
import { IGetPostsByUsernameResponse } from "@/data/post/getPostsByUsername";

interface ICreatePostResponse {
  post: IPost;
  message: string;
}

const createPost = async ({
  post,
  images,
}: {
  post: string;
  images?: {
    url: string;
  }[];
}): Promise<ICreatePostResponse> => {
  // const { uploadImageToS3 } = useImageUploadManager();

  // const signedImages: { url: string }[] = [];
  // if (images) {
  //   for (const uploadedImage of images) {
  //     const convertedUrlToFile = await urlToFile(uploadedImage.url, "image-file.png", "image/png");
  //     const signedUrl = await uploadImageToS3(convertedUrlToFile);

  //     if (!signedUrl) return;
  //     signedImages.push({ url: signedUrl });
  //   }
  // }

  const url = "/api/posts";
  const res = await apiClient.post(url, {
    post: post,
    // images: signedImages,
  });

  return res.data;
};

export const useCreatePost = () => {
  const auth = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      post: string;
      images?: {
        url: string;
      }[];
    }) => createPost(data),
    onError: (error) => {
      console.log(error.message);
      toast.error("Something went wrong. Please try again.");
    },

    onSuccess: (data: ICreatePostResponse) => {
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
    },
  });
};
