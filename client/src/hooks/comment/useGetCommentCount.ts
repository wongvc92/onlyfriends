import { getCommentCountByPostId } from "@/data/comment/getCommentCountByPostId";
import { useQuery } from "@tanstack/react-query";
import { commentKeys } from "./commentKeys";

export const useGetCommentCount = ({ postId }: { postId: string }) => {
  return useQuery({
    queryKey: commentKeys.count(postId),
    queryFn: () => getCommentCountByPostId(postId),
    enabled: !!postId,
  });
};
