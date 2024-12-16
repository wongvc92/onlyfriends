import { useQuery } from "@tanstack/react-query";
import { getLikeByPostId } from "@/data/post/getLikeByPostId";
import { postKeys } from "./postKeys";

export const useGetLikeStatus = ({ postId }: { postId: string }) => {
  return useQuery({ queryKey: postKeys.likes(postId), queryFn: () => getLikeByPostId(postId) });
};
