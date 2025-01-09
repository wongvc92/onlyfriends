import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { commentMaxLimit, editCommentSchema, TEditCommentSchema } from "@/validation/commentSchema";
import Spinner from "../ui/spinner";
import { IoSend } from "react-icons/io5";
import TagFriend from "./tag-friend";
import DynamicTextarea from "../ui/dynamic-textarea";
import { useTagging } from "@/hooks/common/useTagging";
import { IComment } from "@/types/IComment";
import { useEffect } from "react";
import { useEditComment } from "@/hooks/comment/useEditComment";

interface EditCommentProps {
  comment: IComment;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditComment: React.FC<EditCommentProps> = ({ comment, setIsEdit }) => {
  const tag = useTagging();
  const { mutate, isPending, isSuccess } = useEditComment();
  const form = useForm<TEditCommentSchema>({
    resolver: zodResolver(editCommentSchema),
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { tagContent: tag.content, commentId: comment.id },
      {
        onSuccess: () => {
          setIsEdit(false);
          tag.setContent("");
          form.reset();
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form className="relative w-[400px] py-4" onSubmit={onSubmit}>
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
                  className="pb-8 bg-white"
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
          <Button
            type="submit"
            variant="link"
            // onClick={onEditComment}
            disabled={isPending || tag.content.length === 0 || tag.content.length > commentMaxLimit}
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
