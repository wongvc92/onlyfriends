import apiClient from "@/utils/apiClient";

export const deleteFriend = async (peopleId: string) => {
  const url = `/api/friends/${peopleId}`;
  const res = await apiClient.delete(url);
  return res.data;
};
