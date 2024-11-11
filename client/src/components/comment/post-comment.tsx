import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { commentSchema, TCommentSchema } from "@/validation/commentSchema";
import { IPost } from "@/types/IPost";
import Spinner from "../ui/spinner";
import { IoSend } from "react-icons/io5";
import { useRef, useState } from "react";
import TagFriend from "./tag-friend";
import useDebounce from "@/hooks/useDebounce";

import DynamicTextarea from "../ui/dynamic-textarea";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

const PostComment = ({ post }: { post: IPost }) => {
  const [atSymbolIndex, setAtSymbolIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [isTagging, setIstagging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const debouncedSearch = useDebounce(search, 1000);
  const queryClient = useQueryClient();
  const auth = useAuth();

  const form = useForm<TCommentSchema>({
    resolver: zodResolver(commentSchema),
    mode: "onChange",
    defaultValues: {
      comment: "",
    },
  });

  const commentValue = form.watch("comment");

  const addComment = async () => {
    const res = await fetch(`${BASE_URL}/api/comments`, {
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
    toast.success(`Replied to @${post.username}`);
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
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      form.handleSubmit(() => mutate())();
    }
  };

  const onAddPost = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;

    form.setValue("comment", text);
    const atSymbolIndex = text.lastIndexOf("@");

    if (atSymbolIndex !== -1) {
      setAtSymbolIndex(atSymbolIndex);
      const potentialQuery = text.slice(atSymbolIndex + 1);
      setSearch(potentialQuery);
      setIstagging(true);
    } else {
      setSearch("");
    }
  };

  const handleTaggedFriend = (username: string) => {
    const text = form.getValues().comment;
    const newText = text.slice(0, atSymbolIndex) + `@${username} ` + text.slice(atSymbolIndex + search.length + 1);

    // Update the comment field with the new text
    form.setValue("comment", newText);

    // Clear the search and atSymbolIndex states
    setSearch("");
    setAtSymbolIndex(0);
    setIstagging(false);
    textareaRef.current?.focus();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(addComment)} className="space-y-4 sticky bottom-0 bg-white z-10 py-4">
        <p className="text-xs">
          Reply to <span className="text-sky-500">@{post.username}</span>
        </p>
        <FormField
          name="comment"
          render={({ field }) => (
            <FormItem>
              {isTagging && <TagFriend debouncedSearch={debouncedSearch} handleTaggedFriend={handleTaggedFriend} />}
              <FormControl>
                <DynamicTextarea
                  {...field}
                  disabled={isPending}
                  onKeyDown={handleKeyDown}
                  onChange={handleInputChange}
                  ref={textareaRef}
                  className="pb-8"
                />
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
          disabled={isPending || commentValue?.length === 0 || commentValue?.length > 255}
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
