import { FaRegTrashCan } from "react-icons/fa6";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { useAuth } from "@/context/auth";
import { IComment } from "@/types/IComment";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useDeleteComment } from "@/hooks/comment/useDeleteComment";

interface CommentActionProps {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  comment: IComment;
}

const CommentAction: React.FC<CommentActionProps> = ({ comment, setIsEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, mutate, isSuccess } = useDeleteComment();
  const auth = useAuth();

  const onDelete = () => {
    mutate(
      { comment },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
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
          <Button type="button" variant="destructive" onClick={onDelete} className="rounded-full">
            {isPending ? (
              <div className="flex items-center gap-2">
                <Spinner size="4" color="white" /> Deleting...
              </div>
            ) : (
              "Yes"
            )}
          </Button>
          <Button type="button" variant="outline" className="rounded-full" onClick={() => setIsEdit(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <BsThreeDots color="gray" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setIsOpen(true)} className={`${comment.user_id === auth.user?.id ? "flex" : "hidden"}`}>
            <FaRegTrashCan />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEdit(true)} className={`${comment.user_id === auth.user?.id ? "flex" : "hidden"}`}>
            <Pencil1Icon />
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CommentAction;
