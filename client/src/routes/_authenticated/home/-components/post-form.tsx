import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { postSchema, TPostSchema } from "@/validation/postsSchema";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth";

const PostForm = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const form = useForm<TPostSchema>({
    resolver: zodResolver(postSchema),
    mode: "all",
    defaultValues: {
      post: "",
    },
  });

  const addPost = async () => {
    const res = await fetch("http://localhost:5001/api/post", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: form.getValues("post") }),
    });
    if (!res.ok) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    toast.success("Successfully post");
  };

  const { mutate, isPending } = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: [`posts-${auth.user?.username!}`] });
    },
  });

  const handleEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      form.handleSubmit(() => mutate())();
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => mutate())} className="space-y-4">
        <FormField
          name="post"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">What's on your mind?</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isPending} onKeyDown={handleEnterPress} />
              </FormControl>
              {form.formState.errors.post && <FormMessage>{form.formState.errors.post.message}</FormMessage>}
            </FormItem>
          )}
        />

        <Button type="submit" className="w-fit" disabled={isPending}>
          Post
        </Button>
      </form>
    </Form>
  );
};

export default PostForm;
