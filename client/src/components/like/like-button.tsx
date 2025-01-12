import { HeartIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { ICreateLikePayload, useCreateLike } from "@/hooks/like/useCreateLike";
import { useAuth } from "@/context/auth";
import { IPost } from "@/types/IPost";

const LikeButton = ({ post }: { post: IPost }) => {
  const { mutate, isPending } = useCreateLike();
  const { user } = useAuth();
  const content = `${user?.name || user?.username} has liked your post "${post.post.length > 10 ? post.post.substring(0, 10) + "..." : post.post}"`;

  const payload: ICreateLikePayload = {
    author_id: post.author_id,
    content,
    postId: post.id,
  };

  const onLikePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(payload);
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
