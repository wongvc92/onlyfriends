import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageCropProvider } from "@/providers/image-crop-provider";
import { profileSchema, TProfileSchema } from "@/validation/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import ImageUploader from "../image/react-easy-crop/image-uploader";
import { useCreateProfile } from "@/hooks/profile/useCreateProfile";

const AddProfileForm = () => {
  const [rows, setRows] = useState(2);
  const { username } = useParams({ strict: false });
  const { mutate, isPending } = useCreateProfile({ username });

  const form = useForm<TProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      banner_image: "",
      name: "",
      display_image: "",
      bio: "",
      location: "",
      website: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => mutate(form.getValues()))} className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Add Profile</h3>
          <Button type="submit" className="w-fit rounded-full shadow-lg" disabled={isPending}>
            Save
          </Button>
        </div>

        <FormField
          name="banner_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Banner Image</FormLabel>
              <FormControl>
                <ImageCropProvider aspect={4 / 2} cropShape="rect">
                  <ImageUploader onChange={field.onChange} value={field.value} key={"banner_image"} />
                </ImageCropProvider>
              </FormControl>
              {form.formState.errors.banner_image && <FormMessage>{form.formState.errors.banner_image.message}</FormMessage>}
            </FormItem>
          )}
        />

        <FormField
          name="display_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Display Image</FormLabel>
              <FormControl>
                <ImageCropProvider aspect={1} cropShape="round">
                  <ImageUploader onChange={field.onChange} value={field.value} imageShape="rounded-full" key={"display_image"} />
                </ImageCropProvider>
              </FormControl>
              {form.formState.errors.display_image && <FormMessage>{form.formState.errors.display_image.message}</FormMessage>}
            </FormItem>
          )}
        />

        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              {form.formState.errors.name && <FormMessage>{form.formState.errors.name.message}</FormMessage>}
            </FormItem>
          )}
        />

        <FormField
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isPending}
                  rows={rows}
                  ref={(el) => {
                    field.ref(el);
                    if (el) {
                      el.style.height = "auto"; // Reset height
                      el.style.height = `${el.scrollHeight}px`; // Set to scroll height
                    }
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto"; // Reset height
                    target.style.height = `${target.scrollHeight}px`; // Set to scroll height
                  }}
                  style={{ overflow: "hidden" }}
                />
              </FormControl>
              <div className={`flex justify-end text-muted-foreground text-xs ${form.formState.errors.bio && "text-red-500"}`}>
                {form.getValues("bio")?.length}/255
              </div>
              {form.formState.errors.bio && <FormMessage>{form.formState.errors.bio.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Location</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              {form.formState.errors.location && <FormMessage>{form.formState.errors.location.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Website</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              {form.formState.errors.website && <FormMessage>{form.formState.errors.website.message}</FormMessage>}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default AddProfileForm;
