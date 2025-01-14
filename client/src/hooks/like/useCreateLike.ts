import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useParams } from "@tanstack/react-router";
import { useSetLikeData } from "./useSetLikeData";
import { createLikeByPostId, ICreateLikeByPostIdResponse } from "@/api/like/createLikeByPostId";

export const useCreateLike = () => {
  const { username } = useParams({ strict: false });
  const { updateHomePageLikeCount, updateSinglePostLike, updateUserPostLike } = useSetLikeData();
  return useMutation({
    mutationFn: createLikeByPostId,
    onError: (error) => {
      console.log(`${error.message} - create like`);
      toast.error("Failed to like post or post doesn't exist");
    },
    onSuccess: (data: ICreateLikeByPostIdResponse) => {
      updateHomePageLikeCount(data.postId, true, +1);
      updateSinglePostLike(data.postId, true, +1);
      if (username) {
        updateUserPostLike(data.postId, true, +1, username);
      }
    },
  });
};
