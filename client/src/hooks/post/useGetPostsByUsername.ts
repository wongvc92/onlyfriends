import { getPostsByUsername } from "@/api/post/getPostsByUsername";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { postKeys } from "./postKeys";

export const useGetPostsByUsername = () => {
  const { username } = useParams({ strict: false });
  return useInfiniteQuery({
    queryKey: postKeys.userPosts(username as string),
    queryFn: ({ pageParam }) => getPostsByUsername({ pageParam, username: username as string }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!username,
  });
};
