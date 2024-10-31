import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getProfile } from "@/data/getProfile";
import { profileSchema, TProfileSchema } from "@/validation/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const EditProfileForm = () => {
  const queryClient = useQueryClient();
  const { username } = useParams({ strict: false });
  const { data } = useQuery({ queryKey: ["profiles"], queryFn: getProfile });

  const form = useForm<TProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: "all",
    defaultValues: {
      name: "",
      bio: "",
      location: "",
      website: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        bio: data.bio,
        location: data.location,
        website: data.website,
      });
    }
  }, [data, form]);

  const editProfile = async () => {
    const body: TProfileSchema = {
      name: form.getValues().name || "",
      bio: form.getValues().bio || "",
      website: form.getValues().website || "",
      location: form.getValues().location || "",
    };

    if (!data?.id) return;

    const res = await fetch(`http://localhost:5001/api/profiles/${data.id}`, {
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
    toast.success("Successfully post");
    window.location.href = `/${username}`;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => mutate())} className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Edit Profile</h3>
          <Button type="submit" className="w-fit rounded-full shadow-lg" disabled={isPending}>
            Save
          </Button>
        </div>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">name</FormLabel>
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
              <FormLabel className="text-muted-foreground">bio</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isPending} />
              </FormControl>
              {form.formState.errors.bio && <FormMessage>{form.formState.errors.bio.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">location</FormLabel>
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
              <FormLabel className="text-muted-foreground">website</FormLabel>
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
