import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import {
  commentMaxLimit,
  commentSchema,
  TCommentSchema,
} from "@/validation/commentSchema";
import Spinner from "../ui/spinner";
import { IoSend } from "react-icons/io5";
import TagFriend from "./tag-friend";
import DynamicTextarea from "../ui/dynamic-textarea";
import { useTagging } from "@/hooks/useTagging";
import { IComment } from "@/types/IComment";
import { useEffect } from "react";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

interface EditCommentProps {
  comment: IComment;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditComment: React.FC<EditCommentProps> = ({
  comment,
  setIsEdit,
}: EditCommentProps) => {
  const tag = useTagging();

  const queryClient = useQueryClient();
  const auth = useAuth();

  const form = useForm<TCommentSchema>({
    resolver: zodResolver(commentSchema),
    mode: "onChange",
    defaultValues: {
      comment: "",
    },
  });

  useEffect(() => {
    form.reset({
      comment: comment.comment,
    });
    tag.setContent(comment.comment); // Set the initial content for editing
  }, []);

  const editComment = async () => {
    const res = await fetch(`${BASE_URL}/api/comments/${comment.id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: tag.content,
        post_id: comment.post_id,
      }),
    });
    if (!res.ok) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setIsEdit(false);
    tag.setContent("");
    form.reset();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: editComment,
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({
        queryKey: [`posts-${auth.user?.username!}`],
      });
      await queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      await queryClient.invalidateQueries({
        queryKey: ["comments", comment.post_id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["commentsCount", comment.post_id],
      });
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      form.handleSubmit(() => mutate())();
    }
  };

  const onEditComment = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <Form {...form}>
      <form className="relative w-[400px] py-4">
        <FormField
          name="comment"
          render={({ field }) => (
            <FormItem>
              {tag.isTagging && (
                <TagFriend
                  classname="-top-7"
                  debouncedSearch={tag.debouncedSearch}
                  handleTaggedFriend={(username: string) =>
                    tag.handleTaggedFriend(username)
                  }
                />
              )}
              <FormControl>
                <DynamicTextarea
                  {...field}
                  placeholder="Add a comment..."
                  value={tag.content}
                  disabled={isPending}
                  onKeyDown={handleKeyDown}
                  onChange={tag.handleInputChange}
                  ref={tag.textareaRef}
                  className="pb-8 bg-white"
                />
              </FormControl>

              {form.formState.errors.comment && (
                <FormMessage>
                  {form.formState.errors.comment.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end  gap-2 absolute right-3 bottom-3 rounded-full">
          <p
            className={`text-xs ${tag.content.length > 0 ? "block" : "hidden"} ${tag.content.length > commentMaxLimit ? "text-red-500" : "text-muted-foreground"}`}
          >
            {tag.content.length}/{commentMaxLimit}
          </p>
          <Button
            type="button"
            variant="link"
            onClick={onEditComment}
            disabled={
              isPending ||
              tag.content.length === 0 ||
              tag.content.length > commentMaxLimit
            }
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
        </div>
      </form>
    </Form>
  );
};

export default EditComment;
