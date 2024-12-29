import { Button } from "../ui/button";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { useDeleteLike } from "@/hooks/like/useDeleteLike";

const DislikeButton = ({ postId }: { postId: string }) => {
  const { mutate, isPending } = useDeleteLike({ postId });

  const onUnlikePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <form onSubmit={onUnlikePost}>
      <Button variant="link" size="icon" disabled={isPending} type="submit">
        <HeartFilledIcon color="red" />
      </Button>
    </form>
  );
};

export default DislikeButton;
