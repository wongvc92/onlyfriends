import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { contentMaxLimit, postSchema, TPostSchema } from "@/validation/postsSchema";
import DynamicTextarea from "../ui/dynamic-textarea";
import { useTagging } from "@/hooks/common/useTagging";
import TagFriend from "../comment/tag-friend";
import { IPost } from "@/types/IPost";
import { useEffect } from "react";
import { useEditPost } from "@/hooks/post/useEditPost";
import SubmitButton from "../common/submit-button";

interface EditPostFormProps {
  post: IPost;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditPostForm: React.FC<EditPostFormProps> = ({ post, setIsEdit }) => {
  const tag = useTagging();
  const { mutate, isPending } = useEditPost();

  const form = useForm<TPostSchema>({
    resolver: zodResolver(postSchema),
    mode: "onChange",
    defaultValues: {
      post: "",
    },
  });

  useEffect(() => {
    tag.setContent(post.post);
  }, []);

  const onSubmit = () => {
    mutate(
      { tagContent: tag.content, postId: post.id },
      {
        onSuccess: () => {
          tag.setContent("");
          setIsEdit(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              {form.formState.errors.post && <FormMessage>{form.formState.errors.post.message}</FormMessage>}
            </FormItem>
          )}
        />
        <div className="flex justify-end items-center gap-2">
          <p
            className={`text-xs ${tag.content.length > 0 ? "block" : "hidden"} ${tag.content.length > contentMaxLimit ? "text-red-500" : "text-muted-foreground"}`}
          >
            {tag.content.length}/{contentMaxLimit}
          </p>
          <SubmitButton
            defaultTitle="Edit"
            isLoading={isPending}
            disabled={isPending || tag.content.length === 0 || tag.content.length > contentMaxLimit}
            className="w-fit flex items-center gap-2"
          />
        </div>
      </form>
    </Form>
  );
};

export default EditPostForm;
