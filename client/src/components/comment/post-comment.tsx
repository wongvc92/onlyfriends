import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { commentMaxLimit, createCommentSchema, TCreateCommentSchema } from "@/validation/commentSchema";
import { IPost } from "@/types/IPost";
import Spinner from "../ui/spinner";
import { IoSend } from "react-icons/io5";
import TagFriend from "../common/tag-friend";
import DynamicTextarea from "../ui/dynamic-textarea";
import { useTagging } from "@/hooks/common/useTagging";
import { useCreateComment } from "@/hooks/comment/useCreateComment";
import { useScrollStatus } from "@/hooks/common/useScrollStatus";
import { cn } from "@/lib/utils";
import SubmitButton from "../common/submit-button";

const PostComment = ({ post, closeModal }: { post: IPost; closeModal: () => void }) => {
  const tag = useTagging();
  const { mutate, isPending } = useCreateComment(post.id);
  const { isScrolling } = useScrollStatus(300);

  const form = useForm<TCreateCommentSchema>({
    resolver: zodResolver(createCommentSchema),
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
          closeModal();
        },
      }
    );
  };
  return (
    <Form {...form}>
      <form className={cn("relative space-y-4 w-full bg-white dark:bg-background", isScrolling && "hidden")} onSubmit={onSubmit}>
        <p className="text-xs">
          Reply to <span className="text-sky-500">@{post.username}</span>
        </p>
        <FormField
          name="comment"
          render={({ field }) => (
            <FormItem>
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

        <div className="flex items-center justify-end gap-2 absolute right-3 bottom-0 rounded-full">
          <p
            className={`text-xs ${tag.content.length > 0 ? "block" : "hidden"} ${tag.content.length > commentMaxLimit ? "text-red-500" : "text-muted-foreground"}`}
          >
            {tag.content.length}/{commentMaxLimit}
          </p>

          <SubmitButton
            Icon={<IoSend />}
            isLoading={isPending}
            disabled={isPending || tag.content.length === 0 || tag.content.length > commentMaxLimit}
            size="icon"
            variant="link"
          />
        </div>
        {tag.isTagging && (
          <TagFriend
            classname="-top-7 -right-8"
            debouncedSearch={tag.debouncedSearch}
            handleTaggedFriend={(username: string) => tag.handleTaggedFriend(username)}
          />
        )}
      </form>
    </Form>
  );
};

export default PostComment;
