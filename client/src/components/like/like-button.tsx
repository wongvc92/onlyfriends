import { HeartIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { useCreateLike } from "@/hooks/like/useCreateLike";

const LikeButton = ({ postId }: { postId: string }) => {
  const { mutate, isPending } = useCreateLike({ postId });

  const onLikePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <form onSubmit={onLikePost}>
      <Button variant="link" size="icon" disabled={isPending} type="submit">
        <HeartIcon />
      </Button>
    </form>
  );
};

export default LikeButton;
