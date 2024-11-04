import { IFriendStatus } from "@/types/IFriendStatus";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;
export const getFriendStatusByPeopleId = async (peopleId: string): Promise<{ isFriend: boolean; friendStatus: IFriendStatus }> => {
  const url = `${BASE_URL}/api/friends/status/${peopleId}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch friends status");
  }
  const data = await res.json();

  return data;
};
