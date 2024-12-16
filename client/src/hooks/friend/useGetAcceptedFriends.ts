import { useInfiniteQuery } from "@tanstack/react-query";
import { friendKeys } from "./friendKeys";
import { getAcceptedFriends } from "@/data/friend/getAcceptedFriends";
import { useSearch } from "@tanstack/react-router";

export const useGetAcceptedFriends = () => {
  const { query } = useSearch({ from: "/_authenticated/friends/_layout/list/" });
  return useInfiniteQuery({
    queryKey: friendKeys.list("accepted"),
    queryFn: ({ pageParam }) => getAcceptedFriends({ pageParam, query }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
