import { useMutation } from "@tanstack/react-query";
import { IComment } from "@/types/IComment";
import { toast } from "sonner";
import apiClient from "@/utils/apiClient";
import { useSetCommentData } from "./useSetComentData";

export interface IEditCommentResponse {
  comment: IComment;
  message: string;
}

const editComment = async ({ tagContent, commentId }: { tagContent: string; commentId: string }): Promise<IEditCommentResponse> => {
  const url = `/api/comments/${commentId}`;
  const res = await apiClient.put(url, {
    comment: tagContent,
  });
  return res.data;
};

export const useEditComment = () => {
  const { updateSinglePostComment } = useSetCommentData();
  return useMutation({
    mutationFn: (data: { tagContent: string; commentId: string }) => editComment(data),
    onSuccess: (data: IEditCommentResponse) => {
      toast.success("Comment edited.");
      updateSinglePostComment(data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to edit comment");
    },
  });
};
