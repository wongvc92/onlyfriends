import { getPeoples } from "@/api/friend/getPeoples";
import { useInfiniteQuery } from "@tanstack/react-query";
import { peopleKeys } from "./peopleKeys";
import { useSearch } from "@tanstack/react-router";

export const useGetPeoples = () => {
  const search = useSearch({
    strict: false,
  });
  return useInfiniteQuery({
    queryKey: peopleKeys.query("all", search.query || ""),
    queryFn: ({ pageParam }) => getPeoples({ pageParam, query: search.query }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
