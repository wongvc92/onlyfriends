import { urlToFile } from "@/lib/cropImage";
import { useImageUploadManager } from "../common/useImageUploadManager";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/utils/apiClient";
import { postKeys } from "./postKeys";
import { useAuth } from "@/context/auth";

const createPost = async ({
  post,
  images,
}: {
  post: string;
  images?: {
    url: string;
  }[];
}) => {
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

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: postKeys.userPosts(auth.user?.username as string),
      });
    },
  });
};
