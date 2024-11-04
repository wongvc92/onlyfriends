import { IFriendsRequest } from "@/types/IFriendsRequest";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

export const getFriendsRequest = async () => {
  const url = `${BASE_URL}/api/friends/requests`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch friends requests");
  }
  const data = await res.json();
  const friendsRequests: IFriendsRequest[] = data.friendsRequests;
  return friendsRequests;
};
