import { getCommentsByPostId } from "@/data/comment/getCommentsByPostId";
import { useInfiniteQuery } from "@tanstack/react-query";
import { commentKeys } from "./commentKeys";

export const useGetAllComments = ({ postId }: { postId: string }) => {
  return useInfiniteQuery({
    queryKey: commentKeys.list(postId),
    queryFn: ({ pageParam }) => getCommentsByPostId({ pageParam, postId }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
