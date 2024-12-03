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
import {
  contentMaxLimit,
  postSchema,
  TPostSchema,
} from "@/validation/postsSchema";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth";
import DynamicTextarea from "../ui/dynamic-textarea";
import { useTagging } from "@/hooks/useTagging";
import TagFriend from "../comment/tag-friend";
import { IPost } from "@/types/IPost";
import Spinner from "../ui/spinner";
import { useEffect } from "react";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

interface EditPostFormProps {
  post: IPost;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditPostForm: React.FC<EditPostFormProps> = ({ post, setIsEdit }) => {
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

  useEffect(() => {
    tag.setContent(post.post);
  }, []);
  const editPost = async () => {
    const res = await fetch(`${BASE_URL}/api/posts/${post.id}`, {
      method: "PUT",
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
    setIsEdit(false);
    form.reset();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: editPost,
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
              <FormLabel className="text-muted-foreground">Edit post</FormLabel>
              <FormControl>
                <DynamicTextarea
                  {...field}
                  placeholder="Edit post here..."
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
        <div className="flex justify-end items-center gap-2">
          <p
            className={`text-xs ${tag.content.length > 0 ? "block" : "hidden"} ${tag.content.length > contentMaxLimit ? "text-red-500" : "text-muted-foreground"}`}
          >
            {tag.content.length}/{contentMaxLimit}
          </p>
          <Button
            type="submit"
            className="w-fit flex items-center gap-2"
            disabled={
              isPending ||
              tag.content.length === 0 ||
              tag.content.length > contentMaxLimit
            }
          >
            {isPending && <Spinner size="2" />}
            Edit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditPostForm;
