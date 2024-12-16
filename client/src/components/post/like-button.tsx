import { HeartIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { IPost } from "@/types/IPost";
import { useCreateLike } from "@/hooks/post/useCreateLike";

const LikeButton = ({ post }: { post: IPost }) => {
  const { mutate, isPending } = useCreateLike({ postId: post.id });

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
