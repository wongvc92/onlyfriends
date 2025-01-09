import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { IComment } from "@/types/IComment";
import { toast } from "sonner";
import { commentKeys } from "./commentKeys";
import apiClient from "@/utils/apiClient";
import { IGetCommentsByPostIdResponse } from "@/data/comment/getCommentsByPostId";

interface IEditCommentResponse {
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { tagContent: string; commentId: string }) => editComment(data),
    onSuccess: (data: IEditCommentResponse) => {
      toast.success("Comment edited.");

      queryClient.setQueryData(commentKeys.list(data.comment.post_id), (oldData: InfiniteData<IGetCommentsByPostIdResponse> | undefined) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page) => {
          if (!page || !page.data) return page;

          return {
            ...page,
            data: page.data.map((comment) => {
              if (comment.id === data.comment.id) {
                return data.comment;
              }
              return comment;
            }),
          };
        });

        return {
          ...oldData,
          pages: newPages,
        };
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to edit comment");
    },
  });
};
