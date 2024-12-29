import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { commentMaxLimit, commentSchema, TCommentSchema } from "@/validation/commentSchema";
import { IPost } from "@/types/IPost";
import Spinner from "../ui/spinner";
import { IoSend } from "react-icons/io5";
import TagFriend from "./tag-friend";
import DynamicTextarea from "../ui/dynamic-textarea";
import { useTagging } from "@/hooks/common/useTagging";
import { useCreateComment } from "@/hooks/comment/useCreateComment";

const PostComment = ({ post }: { post: IPost }) => {
  const tag = useTagging();
  const { mutate, isPending, isSuccess } = useCreateComment(post.id);

  const form = useForm<TCommentSchema>({
    resolver: zodResolver(commentSchema),
    mode: "onChange",
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { tagContent: tag.content, postId: post.id },
      {
        onSuccess: () => {
          tag.setContent("");
          form.reset();
        },
      }
    );
  };
  return (
    <Form {...form}>
      <form className="space-y-4 sticky bottom-0 bg-white z-10 p-4" onSubmit={onSubmit}>
        <p className="text-xs">
          Reply to <span className="text-sky-500">@{post.username}</span>
        </p>
        <FormField
          name="comment"
          render={({ field }) => (
            <FormItem>
              {tag.isTagging && (
                <TagFriend
                  classname="-top-7"
                  debouncedSearch={tag.debouncedSearch}
                  handleTaggedFriend={(username: string) => tag.handleTaggedFriend(username)}
                />
              )}
              <FormControl>
                <DynamicTextarea
                  {...field}
                  placeholder="Add a comment..."
                  value={tag.content}
                  disabled={isPending}
                  onChange={tag.handleInputChange}
                  ref={tag.textareaRef}
                  className="pb-8"
                />
              </FormControl>

              {form.formState.errors.comment && <FormMessage>{form.formState.errors.comment.message}</FormMessage>}
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end  gap-2 absolute right-3 bottom-3 rounded-full">
          <p
            className={`text-xs ${tag.content.length > 0 ? "block" : "hidden"} ${tag.content.length > commentMaxLimit ? "text-red-500" : "text-muted-foreground"}`}
          >
            {tag.content.length}/{commentMaxLimit}
          </p>

          <Button type="submit" variant="link" disabled={isPending || tag.content.length === 0 || tag.content.length > commentMaxLimit} size="icon">
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

export default PostComment;
