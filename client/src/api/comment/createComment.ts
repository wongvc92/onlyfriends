import { IComment } from "@/types/IComment";
import apiClient from "@/utils/apiClient";

export interface ICreateCommentResponse {
  comment: IComment;
  message: string;
}

export const createComment = async ({ tagContent, postId }: { tagContent: string; postId: string }): Promise<ICreateCommentResponse> => {
  const url = "/api/comments";
  const res = await apiClient.post(url, {
    comment: tagContent,
    post_id: postId,
  });
  return res.data;
};
