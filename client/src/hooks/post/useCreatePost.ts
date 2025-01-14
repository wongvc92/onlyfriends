import { urlToFile } from "@/lib/cropImage";
import { useImageUploadManager } from "../common/useImageUploadManager";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { IPost } from "@/types/IPost";
import { postSchema, TPostSchema } from "@/validation/postsSchema";
import { useSetPostData } from "./useSetPostData";
import { createPost } from "@/api/post/createPost";

export interface ICreatePostResponse {
  post: IPost;
  message: string;
}

export const useCreatePost = () => {
  const { uploadImageToS3 } = useImageUploadManager();
  const { createPostUserPage, createPostHomePage } = useSetPostData();
  return useMutation({
    mutationFn: async (payload: TPostSchema) => {
      const getSignedUrls = async () => {
        const signedUrls: { url: string }[] = [];
        if (payload.images) {
          for (const payloadImage of payload.images) {
            const convertedUrlToFile = await urlToFile(payloadImage.url, "image-file.png", "image/png");
            const signedUrl = await uploadImageToS3(convertedUrlToFile);

            if (signedUrl) {
              signedUrls.push({ url: signedUrl });
            }
          }
        }
        return signedUrls;
      };
      const signedUrls = await getSignedUrls();
      const validationResult = postSchema.safeParse({ post: payload.post, images: signedUrls });

      if (!validationResult.success) {
        throw new Error(validationResult.error.errors[0].message);
      }
      return createPost({ post: payload.post, images: signedUrls });
    },
    onError: (error: any) => {
      if (error.errors) {
        toast.error(error.errors[0].message);
      } else if (error.message) {
        console.log(error.message);
        toast.error(error.message);
      } else {
        console.log(error.message);
        toast.error("Something went wrong. Please try again.");
      }
    },

    onSuccess: (data: ICreatePostResponse) => {
      createPostUserPage(data);
      createPostHomePage(data);
    },
  });
};
