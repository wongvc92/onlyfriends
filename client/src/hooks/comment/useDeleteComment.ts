import { basePath } from "@/utils/basePath";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IComment } from "@/types/IComment";
import { postKeys } from "../post/postKeys";
import { commentKeys } from "./commentKeys";

const deleteComment = async ({ comment }: { comment: IComment }) => {
  const url = basePath(`/api/comments/${comment.id}`);
  const res = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete comment");
  }
  const data = await res.json();
  return data;
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: async () => {
      toast.success("comment deleted");
      queryClient.invalidateQueries({
        queryKey: postKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
    },
  });
};
