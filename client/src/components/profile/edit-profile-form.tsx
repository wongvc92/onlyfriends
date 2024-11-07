import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getProfileByUsername } from "@/data/getProfile";
import { profileSchema, TProfileSchema } from "@/validation/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ImageUploader from "../image/image-uploader";
import { ImageCropProvider } from "@/providers/image-crop-provider";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

const EditProfileForm = () => {
  const queryClient = useQueryClient();
  const { username } = useParams({ strict: false });
  const [rows, setRows] = useState(2);
  const { data } = useQuery({ queryKey: ["profiles"], queryFn: () => getProfileByUsername(username!) });
  const navigate = useNavigate({ from: "/$username/edit" });
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

  useEffect(() => {
    if (data) {
      form.reset({
        banner_image: data.banner_image,
        display_image: data.display_image,
        name: data.name,
        bio: data.bio,
        location: data.location,
        website: data.website,
      });
    }
  }, [data, form]);

  const editProfile = async () => {
    const body: TProfileSchema = {
      banner_image: form.getValues().banner_image || "",
      display_image: form.getValues().display_image || "",
      name: form.getValues().name || "",
      bio: form.getValues().bio || "",
      website: form.getValues().website || "",
      location: form.getValues().location || "",
    };

    if (!data?.id) return;

    const res = await fetch(`${BASE_URL}/api/profiles/${data.id}`, {
      method: "PUT",
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
    await navigate({ to: "/$username" });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
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
      <form onSubmit={form.handleSubmit(() => mutate())} className="space-y-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Edit Profile</h3>
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
                  onKeyDown={handleKeyDown}
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

export default EditProfileForm;
