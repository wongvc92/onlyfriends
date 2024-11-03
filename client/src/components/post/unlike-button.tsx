import { IPost } from "@/types/IPost";
import { Button } from "../ui/button";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const UnLikeButton = ({ post }: { post: IPost }) => {
  const queryClient = useQueryClient();

  const unlikePost = async () => {
    const url = "http://localhost:5001/api/likes";

    const res = await fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId: post.id }),
    });

    if (!res.ok) {
      throw new Error("Failed unlike post");
    }
    return await res.json();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: unlikePost,
    onSuccess: () =>
      Promise.all([
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: [`likes-${post.id}`] }),
      ]),
  });

  const onUnlikePost = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <Button variant="link" size="icon" onClick={onUnlikePost} disabled={isPending}>
      <HeartFilledIcon color="red" />
    </Button>
  );
};

export default UnLikeButton;
