import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { postSchema, TPostSchema } from "@/validation/postsSchema";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const PostForm = () => {
  const queryClient = useQueryClient();

  const form = useForm<TPostSchema>({
    resolver: zodResolver(postSchema),
    mode: "all",
    defaultValues: {
      post: "",
    },
  });

  const addPost = async () => {
    console.log(`form.getValues("post")`, form.getValues().post);
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
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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
