import { getAllPosts } from "@/api/post/getAllPosts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { postKeys } from "./postKeys";

export const useGetAllPosts = () => {
  return useInfiniteQuery({
    queryKey: postKeys.list(),
    queryFn: getAllPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
