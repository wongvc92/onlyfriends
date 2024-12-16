import { useQuery } from "@tanstack/react-query";
import { postKeys } from "./postKeys";
import { getPostByPostId } from "@/data/post/getPostByPostId";

export const useGetPostById = ({ postId }: { postId?: string }) => {
  return useQuery({
    queryKey: postKeys.detail(postId as string),
    queryFn: () => getPostByPostId(postId as string),
    enabled: !!postId,
  });
};
