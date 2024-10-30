import { FaRegTrashCan } from "react-icons/fa6";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";

const PostACtion = ({ postId }: { postId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const deletePost = async () => {
    const res = await fetch(`/api/post?id=${postId}`, {
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
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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
          <Button type="button" variant="destructive" onClick={onDelete} className="rounded-full">
            {isPending ? (
              <div className="flex items-center gap-2">
                <Spinner size="4" color="white" /> Deleting...
              </div>
            ) : (
              "Yes"
            )}
          </Button>
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
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <FaRegTrashCan />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default PostACtion;
