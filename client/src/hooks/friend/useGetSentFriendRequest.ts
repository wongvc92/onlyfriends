import { getSentFriendRequests } from "@/api/friend/getSentFriendRequests";
import { useInfiniteQuery } from "@tanstack/react-query";
import { friendKeys } from "./friendKeys";

export const useGetSentFriendRequest = () => {
  return useInfiniteQuery({
    queryKey: friendKeys.list("sent"),
    queryFn: getSentFriendRequests,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
