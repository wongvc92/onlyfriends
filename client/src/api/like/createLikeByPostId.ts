import apiClient from "@/utils/apiClient";
import { createlikeSchema } from "@/validation/likeSchema";

export interface ICreateLikeByPostIdResponse {
  postId: string;
}

export interface ICreateLikePayload {
  postId: string;
  author_id: string;
  content: string;
}

export const createLikeByPostId = async ({ postId, author_id, content }: ICreateLikePayload): Promise<ICreateLikeByPostIdResponse> => {
  const parsed = createlikeSchema.safeParse({ params: { postId }, body: { author_id, content } });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }
  const url = `/api/likes/${parsed.data.params.postId}`;
  const res = await apiClient.post(url, { author_id: parsed.data.body.author_id, content: parsed.data.body.content });
  return res.data;
};
