import apiClient from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useParams } from "@tanstack/react-router";
import { createlikeSchema } from "@/validation/likeSchema";
import { useSetLikeData } from "./useSetLikeData";

export interface ICreateLikeByPostIdResponse {
  postId: string;
}

export interface ICreateLikePayload {
  postId: string;
  author_id: string;
  content: string;
}

const createLikeByPostId = async ({ postId, author_id, content }: ICreateLikePayload): Promise<ICreateLikeByPostIdResponse> => {
  const parsed = createlikeSchema.safeParse({ params: { postId }, body: { author_id, content } });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }
  const url = `/api/likes/${parsed.data.params.postId}`;
  const res = await apiClient.post(url, { author_id: parsed.data.body.author_id, content: parsed.data.body.content });
  return res.data;
};

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
