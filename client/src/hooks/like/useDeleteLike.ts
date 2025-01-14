import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useParams } from "@tanstack/react-router";
import { useSetLikeData } from "./useSetLikeData";
import { dislikePost, IDeleteLikeByPostIdResponse } from "@/api/like/dislikePost";

export const useDeleteLike = () => {
  const { username } = useParams({ strict: false });
  const { updateHomePageLikeCount, updateSinglePostLike, updateUserPostLike } = useSetLikeData();
  return useMutation({
    mutationFn: dislikePost,
    onError: (error) => {
      console.log(`${error.message} - delete like`);
      toast.error("Failed to dislike post or post doesn't exist.");
    },
    onSuccess: (data: IDeleteLikeByPostIdResponse) => {
      updateHomePageLikeCount(data.postId, false, -1);
      updateSinglePostLike(data.postId, false, -1);

      if (username) {
        updateUserPostLike(data.postId, false, -1, username);
      }
    },
  });
};
