import apiClient from "@/utils/apiClient";

export const getLikeByPostId = async (postId: string): Promise<{ isLiked: boolean; likesCount: number }> => {
  const url = `/api/likes/${postId}`;
  const res = await apiClient.get(url);
  return res.data;
};
