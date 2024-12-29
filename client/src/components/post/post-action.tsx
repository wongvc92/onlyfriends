import { FaRegTrashCan } from "react-icons/fa6";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IPost } from "@/types/IPost";
import { useAuth } from "@/context/auth";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useDeletePost } from "@/hooks/post/useDeletePost";
import SubmitButton from "../common/submit-button";

interface PostActionProps {
  post: IPost;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}
const PostAction: React.FC<PostActionProps> = ({ post, setIsEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useDeletePost();
  const auth = useAuth();

  const onDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(post.id, { onSuccess: () => setIsOpen(false), onError: () => setIsOpen(false) });
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
          <form onSubmit={onDelete}>
            <SubmitButton defaultTitle="Yes" isLoadingTitle="Deleting..." isLoading={isPending} className="rounded-full" variant="destructive" />
          </form>

          <Button type="button" variant="outline" className="rounded-full" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <BsThreeDots color="gray" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setIsOpen(true)} className={`${post.author_id === auth.user?.id ? "flex" : "hidden"}`}>
            <FaRegTrashCan />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEdit(true)} className={`${post.author_id === auth.user?.id ? "flex" : "hidden"}`}>
            <Pencil1Icon />
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default PostAction;
