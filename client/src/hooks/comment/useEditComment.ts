import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSetCommentData } from "./useSetComentData";
import { editComment, IEditCommentResponse } from "@/api/comment/editComment";

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
