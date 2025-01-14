import apiClient from "@/utils/apiClient";

export const createFriend = async (peopleId: string) => {
  const url = "/api/friends";
  const res = await apiClient.post(url, { peopleId });
  return res.data;
};
