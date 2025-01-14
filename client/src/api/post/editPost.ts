import { IPost } from "@/types/IPost";
import apiClient from "@/utils/apiClient";

export interface IEditPostResponse {
    post: IPost;
    message: string;
  }
  export const editPost = async ({ tagContent, postId }: { tagContent: string; postId: string }): Promise<IEditPostResponse> => {
    const url = `/api/posts/${postId}`;
    const res = await apiClient.put(url, { post: tagContent });
    return res.data;
  };