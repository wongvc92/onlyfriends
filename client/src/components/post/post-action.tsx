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
  startEdit: () => void;
}
const PostAction: React.FC<PostActionProps> = ({ post, startEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useDeletePost();
  const auth = useAuth();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const onDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(post.id, { onSuccess: closeModal, onError: closeModal });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} title="Delete post" description="Are you sure to perform this action?" classname="w-[400px]">
        <div className="flex items-center gap-2 justify-end">
          <form onSubmit={onDelete}>
            <SubmitButton defaultTitle="Yes" isLoadingTitle="Deleting..." isLoading={isPending} className="rounded-full" variant="destructive" />
          </form>

          <Button type="button" variant="outline" className="rounded-full" onClick={closeModal}>
            Cancel
          </Button>
        </div>
      </Modal>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <BsThreeDots color="gray" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={openModal} className={`${post.author_id === auth.user?.id ? "flex" : "hidden"}`}>
            <FaRegTrashCan />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem onClick={startEdit} className={`${post.author_id === auth.user?.id ? "flex" : "hidden"}`}>
            <Pencil1Icon />
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default PostAction;
