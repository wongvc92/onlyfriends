import { IFriendsRequest } from "@/types/IFriendsRequest";
import { IPeople } from "@/types/IPeople";

export const getFriendsRequest = async () => {
  const url = "http://localhost:5001/api/friends/requests";

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
