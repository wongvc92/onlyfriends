import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSetPostData } from "./useSetPostData";
import { editPost, IEditPostResponse } from "@/api/post/editPost";

export const useEditPost = () => {
  const { updatePostHomePage, updateSinglePost } = useSetPostData();
  return useMutation({
    mutationFn: editPost,
    onError: (error: any) => {
      if (error.errors) {
        toast.error(error.errors[0].message);
      } else if (error.message) {
        console.log(error.message);
        toast.error(error.message);
      } else {
        console.log(error.message);
        toast.error("Something went wrong. Please try again.");
      }
    },
    onSuccess: async (data: IEditPostResponse) => {
      toast.success("Successfully edited post.");
      updatePostHomePage(data);
      updateSinglePost(data);
    },
  });
};
