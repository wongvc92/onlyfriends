import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { postSchema, TPostSchema } from "@/validation/postsSchema";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth";
import DynamicTextarea from "../ui/dynamic-textarea";
import { useTagging } from "@/hooks/useTagging";
import TagFriend from "../comment/tag-friend";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

const PostForm = () => {
  const tag = useTagging();

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
    const res = await fetch(`${BASE_URL}/api/post`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: tag.content }),
    });
    if (!res.ok) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    toast.success("Successfully post");
    tag.setContent("");
    form.reset();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: addPost,
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({
        queryKey: [`posts-${auth.user?.username!}`],
      });
      await queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.refetchQueries({
        queryKey: [`posts-${auth.user?.username!}`],
      });
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
            <FormItem className="relative">
              <FormLabel className="text-muted-foreground">
                What's on your mind?
              </FormLabel>
              <FormControl>
                <DynamicTextarea
                  {...field}
                  placeholder="Add a post..."
                  value={tag.content}
                  onChange={tag.handleInputChange}
                  disabled={isPending}
                  onKeyDown={handleEnterPress}
                  ref={tag.textareaRef}
                />
              </FormControl>
              {tag.isTagging && (
                <TagFriend
                  debouncedSearch={tag.debouncedSearch}
                  handleTaggedFriend={(username: string) => {
                    tag.handleTaggedFriend(username);
                  }}
                />
              )}
              {form.formState.errors.post && (
                <FormMessage>{form.formState.errors.post.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-fit"
            disabled={
              isPending || tag.content.length === 0 || tag.content.length > 255
            }
          >
            Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
