import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { profileSchema, TProfileSchema } from "@/validation/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGetProfile } from "@/hooks/profile/useGetProfile";
import { useEditProfile } from "@/hooks/profile/useEditProfile";
import SubmitButton from "../common/submit-button";
import DynamicTextarea from "../ui/dynamic-textarea";
import { ImageCropProvider } from "@/context/image-crop";
import ImageUploader from "../image/react-easy-crop/image-uploader";

const EditProfileForm = () => {
  const { username } = useParams({ strict: false });
  const { data } = useGetProfile({ username });
  const { mutate, isPending } = useEditProfile();

  const form = useForm<TProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      id: "",
      banner_image: "",
      name: "",
      display_image: "",
      bio: "",
      location: "",
      website: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        id: data.id,
        banner_image: data.banner_image,
        display_image: data.display_image,
        name: data.name,
        bio: data.bio,
        location: data.location,
        website: data.website,
      });
    }
  }, [data, form]);

  const onSubmit = (data: TProfileSchema) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Edit Profile</h3>
          <SubmitButton defaultTitle="Save" isLoadingTitle="Saving..." className="w-fit rounded-full shadow-lg" isLoading={isPending} />
        </div>

        <FormField
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground hidden">id</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} style={{ visibility: "hidden" }} />
              </FormControl>
              {form.formState.errors.id && <FormMessage>{form.formState.errors.id.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          name="banner_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Banner Image</FormLabel>
              <FormControl>
                <ImageCropProvider aspect={4 / 2} cropShape="rect">
                  <ImageUploader onChange={field.onChange} value={field.value} key="banner_image" />
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
                  <ImageUploader onChange={field.onChange} value={field.value} imageShape="rounded-full" key="display_image" />
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
                <DynamicTextarea {...field} disabled={isPending} style={{ overflow: "hidden" }} />
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

export default EditProfileForm;
