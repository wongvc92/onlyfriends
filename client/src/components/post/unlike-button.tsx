import { IPost } from "@/types/IPost";
import { Button } from "../ui/button";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

const UnLikeButton = ({ post }: { post: IPost }) => {
  const queryClient = useQueryClient();

  const unlikePost = async () => {
    const url = `${BASE_URL}/api/likes`;

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
