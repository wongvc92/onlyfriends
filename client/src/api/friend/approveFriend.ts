import apiClient from "@/utils/apiClient";

export const approveFriend = async (friendRequestId: string) => {
  const url = `/api/friends/${friendRequestId}`;
  const res = await apiClient.put(url);
  return res.data;
};
