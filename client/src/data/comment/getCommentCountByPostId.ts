import apiClient from "@/utils/apiClient";

export const getCommentCountByPostId = async (commentId: string): Promise<{ count: number }> => {
  const url = `/api/comments/count/${commentId}`;
  const res = await apiClient.get(url);
  return res.data;
};
