import { ICreatePostResponse } from "@/hooks/post/useCreatePost";
import apiClient from "@/utils/apiClient";
import { TPostSchema } from "@/validation/postsSchema";

export const createPost = async ({ post, images }: TPostSchema): Promise<ICreatePostResponse> => {
  const url = "/api/posts";
  const res = await apiClient.post(url, {
    post,
    images,
  });

  return res.data;
};
