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

const editComment = async ({ tagContent, comment }: { tagContent: string; comment: IComment }): Promise<IEditCommentResponse> => {
  const url = `/api/comments/${comment.id}`;
  const res = await apiClient.put(url, {
    comment: tagContent,
    post_id: comment.post_id,
  });

  return res.data;
};

export const useEditComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { tagContent: string; comment: IComment }) => editComment(data),
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
