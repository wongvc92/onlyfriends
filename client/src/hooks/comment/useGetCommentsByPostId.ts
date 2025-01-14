import { getCommentsByPostId } from "@/api/comment/getCommentsByPostId";
import { useInfiniteQuery } from "@tanstack/react-query";
import { commentKeys } from "./commentKeys";

export const useGetCommentsByPostId = ({ postId }: { postId: string }) => {
  return useInfiniteQuery({
    queryKey: commentKeys.list(postId),
    queryFn: ({ pageParam }) => getCommentsByPostId({ pageParam, postId }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
