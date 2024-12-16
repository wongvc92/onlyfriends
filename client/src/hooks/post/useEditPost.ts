import { basePath } from "@/utils/basePath";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { postKeys } from "./postKeys";

const editPost = async ({ tagContent, postId }: { tagContent: string; postId: string }) => {
  const url = basePath(`/api/posts/${postId}`);
  const res = await fetch(url, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ post: tagContent }),
  });
  if (!res.ok) {
    toast.error("Something went wrong. Please try again.");
    return;
  }
};

export const useEditPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editPost,
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
    onSuccess: async () => {
      toast.success("Successfully edited post.");

      await queryClient.invalidateQueries({
        queryKey: postKeys.all,
      });
    },
  });
};
