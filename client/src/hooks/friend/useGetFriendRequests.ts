import { getFriendsRequests } from "@/api/friend/getFriendsRequests";
import { useInfiniteQuery } from "@tanstack/react-query";
import { friendKeys } from "./friendKeys";

export const useGetFriendRequests = () => {
  return useInfiniteQuery({
    queryKey: friendKeys.list("pending"),
    queryFn: getFriendsRequests,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
