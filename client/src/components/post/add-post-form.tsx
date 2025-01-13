import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { contentMaxLimit, postSchema, TPostSchema } from "@/validation/postsSchema";
import { toast } from "sonner";
import DynamicTextarea from "../ui/dynamic-textarea";
import { useTagging } from "@/hooks/common/useTagging";
import TagFriend from "../common/tag-friend";
import MultiImageUploader from "../image/react-image-crop/multi-image-uploader";
import { useCreatePost } from "@/hooks/post/useCreatePost";
import SubmitButton from "../common/submit-button";

interface PostFormProps {
  onClose: () => void;
}
const AddPostForm: React.FC<PostFormProps> = ({ onClose }) => {
  const tag = useTagging();
  const { mutate, isPending } = useCreatePost();

  const form = useForm<TPostSchema>({
    resolver: zodResolver(postSchema),
    mode: "onChange",
    defaultValues: {
      post: "",
      images: [],
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { post: tag.content, images: form.getValues("images") },
      {
        onSuccess: () => {
          onClose();
          toast.success("Successfully post");
          tag.setContent("");
          form.reset();
        },
      }
    );
  };
  const isAtLeastOneFieldFilled = tag.content.trim().length > 0 || (form.getValues("images") || []).length > 0;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          name="post"
          render={({ field }) => (
            <FormItem className="relative ">
              <FormLabel className="text-muted-foreground">What's on your mind?</FormLabel>
              <FormControl>
                <DynamicTextarea
                  {...field}
                  placeholder="Add a post..."
                  value={tag.content}
                  onChange={tag.handleInputChange}
                  disabled={isPending}
                  ref={tag.textareaRef}
                  className="pb-12"
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
              <div className="absolute bottom-2 right-2 flex justify-end items-center gap-2">
                <p
                  className={`text-xs ${tag.content.length > 0 ? "block" : "hidden"} ${tag.content.length > contentMaxLimit ? "text-red-500" : "text-muted-foreground"}`}
                >
                  {tag.content.length}/{contentMaxLimit}
                </p>
                <SubmitButton
                  isLoading={isPending}
                  defaultTitle="Post"
                  className="w-fit"
                  disabled={isPending || tag.content.length > contentMaxLimit || !isAtLeastOneFieldFilled}
                />
              </div>
            </FormItem>
          )}
        />

        <FormField
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MultiImageUploader
                  value={form.watch("images") || []} // Sync value with form
                  onChange={(newImages) => form.setValue("images", newImages)} // Update form stat
                />
              </FormControl>
              {form.formState.errors.images && <FormMessage>{form.formState.errors.images.message}</FormMessage>}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default AddPostForm;
