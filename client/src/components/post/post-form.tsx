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
import MultiImageUploader from "../image/react-image-crop/multi-image-uploader";
import { useImageUploadManager } from "@/hooks/useImageUploadManager";
import { urlToFile } from "@/lib/cropImage";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

interface PostFormProps {
  onClose: () => void;
}
const PostForm: React.FC<PostFormProps> = ({ onClose }) => {
  const tag = useTagging();
  const { uploadImageToS3 } = useImageUploadManager();
  const queryClient = useQueryClient();
  const auth = useAuth();
  const form = useForm<TPostSchema>({
    resolver: zodResolver(postSchema),
    mode: "onChange",
    defaultValues: {
      post: "",
      images: [],
    },
  });

  console.log("form", form.watch().images);

  const addPost = async () => {
    const uploadedImages = form.getValues("images");
    console.log("uploadedImages", uploadedImages);

    const signedImages: { url: string }[] = [];
    if (uploadedImages) {
      for (const uploadedImage of uploadedImages) {
        const convertedUrlToFile = await urlToFile(
          uploadedImage.url,
          "image-file.png",
          "image/png"
        );
        const signedUrl = await uploadImageToS3(convertedUrlToFile);

        if (!signedUrl) return;
        signedImages.push({ url: signedUrl });
      }
    }

    const res = await fetch(`${BASE_URL}/api/posts`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post: tag.content,
        images: signedImages,
      }),
    });
    if (!res.ok) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    onClose();
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
            <FormItem className="relative ">
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
              {form.formState.errors.post && (
                <FormMessage>{form.formState.errors.post.message}</FormMessage>
              )}
              <div className="absolute bottom-2 right-2 flex justify-end items-center gap-2">
                <p
                  className={`text-xs ${tag.content.length > 0 ? "block" : "hidden"} ${tag.content.length > contentMaxLimit ? "text-red-500" : "text-muted-foreground"}`}
                >
                  {tag.content.length}/{contentMaxLimit}
                </p>
                <Button
                  type="submit"
                  className="w-fit"
                  disabled={isPending || tag.content.length > contentMaxLimit}
                >
                  Post
                </Button>
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
              {form.formState.errors.images && (
                <FormMessage>
                  {form.formState.errors.images.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default PostForm;
