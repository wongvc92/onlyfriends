import { useInfiniteQuery } from "@tanstack/react-query";
import { friendKeys } from "./friendKeys";
import { getAcceptedFriends } from "@/api/friend/getAcceptedFriends";

export const useGetAcceptedFriends = ({ query = undefined }: { query?: string }) => {
  return useInfiniteQuery({
    queryKey: friendKeys.query("accepted", query || ""),
    queryFn: ({ pageParam }) => getAcceptedFriends({ pageParam, query }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
