import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { commentSchema, TCommentSchema } from "@/validation/commentSchema";
import { IPost } from "@/types/IPost";
import Spinner from "../ui/spinner";
import { BsSend, BsSendCheckFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { Input } from "../ui/input";

const PostComment = ({ post }: { post: IPost }) => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const form = useForm<TCommentSchema>({
    resolver: zodResolver(commentSchema),
    mode: "all",
    defaultValues: {
      comment: "",
    },
  });

  const addComment = async () => {
    const res = await fetch("http://localhost:5001/api/comments", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: form.getValues().comment, post_id: post.id }),
    });
    if (!res.ok) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    toast.success("Successfully post");
    form.reset();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: addComment,
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: [`posts-${auth.user?.username!}`] });
      await queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      await queryClient.invalidateQueries({ queryKey: [`comments-${post.id!}`] });
      await queryClient.invalidateQueries({ queryKey: [`commentsCount-${post.id}`] });

      // queryClient.refetchQueries({ queryKey: [`posts-${auth.user?.username!}`] });
    },
  });

  const handleEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      form.handleSubmit(() => mutate())();
    }
  };

  const onAddPost = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(addComment)} className="space-y-4 sticky bottom-0 bg-white z-10 p-4">
        <FormField
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} disabled={isPending} onKeyDown={handleEnterPress} />
              </FormControl>
              {form.formState.errors.comment && <FormMessage>{form.formState.errors.comment.message}</FormMessage>}
            </FormItem>
          )}
        />

        <Button
          type="button"
          variant="link"
          className="w-fit absolute right-6 bottom-3 rounded-full"
          onClick={onAddPost}
          disabled={isPending || form.getValues().comment === ""}
          size="icon"
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <Spinner size="4" color="black" />
            </div>
          ) : (
            <IoSend size="4" />
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PostComment;
