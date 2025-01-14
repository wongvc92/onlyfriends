import { IPost } from "@/types/IPost";
import apiClient from "@/utils/apiClient";
import { deletePostSchema } from "@/validation/postsSchema";

export interface IDeletePostResponse {
  message: string;
  post: IPost;
}
export const deletePost = async (postId: string): Promise<IDeletePostResponse> => {
  const parsed = deletePostSchema.safeParse({ postId });

  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }

  const url = `/api/posts/${parsed.data.postId}`;
  const res = await apiClient.delete(url);
  return res.data;
};
