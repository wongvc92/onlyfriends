import apiClient from "@/utils/apiClient";

export const cancelAddFriend = async (peopleId: string) => {
  const url = `/api/friends/${peopleId}`;
  const res = await apiClient.delete(url);
  return res.data;
};
