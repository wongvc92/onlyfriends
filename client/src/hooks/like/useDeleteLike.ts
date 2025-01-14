import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/utils/apiClient";
import { useParams } from "@tanstack/react-router";
import { deleteLikeSchema } from "@/validation/likeSchema";
import { useSetLikeData } from "./useSetLikeData";

interface IDeleteLikeByPostIdResponse {
  postId: string;
}

export interface IDeleteLikePayload {
  postId: string;
  author_id: string;
}

const dislikePost = async ({ postId, author_id }: IDeleteLikePayload) => {
  const parsed = deleteLikeSchema.safeParse({ params: { postId }, body: { author_id } });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }
  const url = `/api/likes/${parsed.data.params.postId}`;
  const res = await apiClient.delete(url, { data: { author_id: parsed.data.body.author_id } });
  return res.data;
};

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
