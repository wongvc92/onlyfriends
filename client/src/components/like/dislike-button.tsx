import { Button } from "../ui/button";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { useDeleteLike } from "@/hooks/like/useDeleteLike";
import { IPost } from "@/types/IPost";

const DislikeButton = ({ post }: { post: IPost }) => {
  const { mutate, isPending } = useDeleteLike();

  const onUnlikePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ author_id: post.author_id, postId: post.id });
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
