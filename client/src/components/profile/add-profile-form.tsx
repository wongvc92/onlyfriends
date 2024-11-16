import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageCropProvider } from "@/providers/image-crop-provider";
import { profileSchema, TProfileSchema } from "@/validation/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import ImageUploader from "../image/react-easy-crop/image-uploader";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

const AddProfileForm = () => {
  const [rows, setRows] = useState(2);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { username } = useParams({ strict: false });
  const form = useForm<TProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: "all",
    defaultValues: {
      banner_image: "",
      name: "",
      display_image: "",
      bio: "",
      location: "",
      website: "",
    },
  });

  const addProfile = async () => {
    const body: TProfileSchema = {
      banner_image: form.getValues().banner_image || "",
      display_image: form.getValues().display_image || "",
      name: form.getValues().name || "",
      bio: form.getValues().bio || "",
      website: form.getValues().website || "",
      location: form.getValues().location || "",
    };

    const res = await fetch(`${BASE_URL}/api/profiles`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    toast.success("Successfully add profile!");
    await router.invalidate();
    window.location.href = `/${username}`;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: addProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profiles"] }),
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      setRows((prevRows) => prevRows + 1);
    }
    if (e.key === "Backspace") {
      setRows((prevRows) => prevRows - 1);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => mutate())} className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Add Profile</h3>
          <Button
            type="submit"
            className="w-fit rounded-full shadow-lg"
            disabled={isPending}
          >
            Save
          </Button>
        </div>

        <FormField
          name="banner_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">
                Banner Image
              </FormLabel>
              <FormControl>
                <ImageCropProvider aspect={4 / 2} cropShape="rect">
                  <ImageUploader
                    onChange={field.onChange}
                    value={field.value}
                    key={"banner_image"}
                  />
                </ImageCropProvider>
              </FormControl>
              {form.formState.errors.banner_image && (
                <FormMessage>
                  {form.formState.errors.banner_image.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          name="display_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">
                Display Image
              </FormLabel>
              <FormControl>
                <ImageCropProvider aspect={1} cropShape="round">
                  <ImageUploader
                    onChange={field.onChange}
                    value={field.value}
                    imageShape="rounded-full"
                    key={"display_image"}
                  />
                </ImageCropProvider>
              </FormControl>
              {form.formState.errors.display_image && (
                <FormMessage>
                  {form.formState.errors.display_image.message}
                </FormMessage>
              )}
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
              {form.formState.errors.name && (
                <FormMessage>{form.formState.errors.name.message}</FormMessage>
              )}
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
                  onKeyDown={handleKeyDown}
                  style={{ overflow: "hidden" }}
                />
              </FormControl>
              <div
                className={`flex justify-end text-muted-foreground text-xs ${form.formState.errors.bio && "text-red-500"}`}
              >
                {form.getValues("bio")?.length}/255
              </div>
              {form.formState.errors.bio && (
                <FormMessage>{form.formState.errors.bio.message}</FormMessage>
              )}
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
              {form.formState.errors.location && (
                <FormMessage>
                  {form.formState.errors.location.message}
                </FormMessage>
              )}
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
              {form.formState.errors.website && (
                <FormMessage>
                  {form.formState.errors.website.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default AddProfileForm;
