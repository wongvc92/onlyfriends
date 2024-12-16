import { IPost } from "@/types/IPost";
import apiClient from "@/utils/apiClient";

export const getPostByPostId = async (postId: string): Promise<IPost> => {
  const url = `/api/posts/${postId}`;
  const res = await apiClient.get(url);
  return res.data.post;
};
