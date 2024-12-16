import { IFriendStatus } from "@/types/IFriendStatus";
import apiClient from "@/utils/apiClient";

export const getFriendStatusByPeopleId = async (peopleId: string): Promise<{ isFriend: boolean; friendStatus: IFriendStatus }> => {
  const url = `/api/friends/status/${peopleId}`;
  const res = await apiClient.get(url);
  return res.data;
};
