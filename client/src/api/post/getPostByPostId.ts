import { IPost } from "@/types/IPost";
import apiClient from "@/utils/apiClient";
import { getPostByPostIdSchema } from "@/validation/postsSchema";

export const getPostByPostId = async (postId: string): Promise<IPost> => {
  const parsed = getPostByPostIdSchema.safeParse({ params: { postId } });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }

  const url = `/api/posts/${parsed.data.params.postId}`;
  const res = await apiClient.get(url);
  return res.data.post;
};
