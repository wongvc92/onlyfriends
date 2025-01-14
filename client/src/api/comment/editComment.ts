import { IComment } from "@/types/IComment";
import apiClient from "@/utils/apiClient";

export interface IEditCommentResponse {
    comment: IComment;
    message: string;
  }
  
  export const editComment = async ({ tagContent, commentId }: { tagContent: string; commentId: string }): Promise<IEditCommentResponse> => {
    const url = `/api/comments/${commentId}`;
    const res = await apiClient.put(url, {
      comment: tagContent,
    });
    return res.data;
  };