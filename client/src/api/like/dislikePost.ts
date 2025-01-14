import apiClient from "@/utils/apiClient";
import { deleteLikeSchema } from "@/validation/likeSchema";

export interface IDeleteLikeByPostIdResponse {
  postId: string;
}

export interface IDeleteLikePayload {
  postId: string;
  author_id: string;
}

export const dislikePost = async ({ postId, author_id }: IDeleteLikePayload) => {
  const parsed = deleteLikeSchema.safeParse({ params: { postId }, body: { author_id } });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }
  const url = `/api/likes/${parsed.data.params.postId}`;
  const res = await apiClient.delete(url, { data: { author_id: parsed.data.body.author_id } });
  return res.data;
};
