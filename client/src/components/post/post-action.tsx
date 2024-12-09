import { FaRegTrashCan } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";
import { IPost } from "@/types/IPost";
import { useAuth } from "@/context/auth";
import { Pencil1Icon } from "@radix-ui/react-icons";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

interface PostActionProps {
  post: IPost;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}
const PostACtion: React.FC<PostActionProps> = ({ post, setIsEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const auth = useAuth();
  const deletePost = async () => {
    const res = await fetch(`${BASE_URL}/api/post?id=${post.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.log("errorData", errorData);
      toast.error(errorData.message);
      return errorData;
    }
    const data = await res.json();
    setIsOpen(false);
    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: deletePost,
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({
        queryKey: [`posts-${auth.user?.username!}`],
      });
      await queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
  });

  const onDelete = () => {
    mutate();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete post"
        description="Are you sure to perform this action?"
        classname="w-[400px]"
      >
        <div className="flex items-center gap-2 justify-end">
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            className="rounded-full"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Spinner size="4" color="white" /> Deleting...
              </div>
            ) : (
              "Yes"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <BsThreeDots color="gray" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setIsOpen(true)}
            className={`${post.user_id === auth.user?.id ? "flex" : "hidden"}`}
          >
            <FaRegTrashCan />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsEdit(true)}
            className={`${post.user_id === auth.user?.id ? "flex" : "hidden"}`}
          >
            <Pencil1Icon />
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default PostACtion;
