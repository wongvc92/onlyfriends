import { HeartIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { IPost } from "@/types/IPost";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LikeButton = ({ post }: { post: IPost }) => {
  const queryClient = useQueryClient();

  const likePost = async () => {
    const url = "http://localhost:5001/api/likes";

    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId: post.id }),
    });

    if (!res.ok) {
      throw new Error("Failed like post");
    }
    return await res.json();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: likePost,
    onSuccess: () =>
      Promise.all([
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: [`likes-${post.id}`] }),
      ]),
  });

  const onLikePost = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <Button variant="link" size="icon" onClick={onLikePost} disabled={isPending}>
      <HeartIcon />
    </Button>
  );
};

export default LikeButton;
