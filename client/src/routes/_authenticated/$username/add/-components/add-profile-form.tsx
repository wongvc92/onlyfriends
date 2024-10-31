import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { profileSchema, TProfileSchema } from "@/validation/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const AddProfileForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { username } = useParams({ strict: false });
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

  const addProfile = async () => {
    const body: TProfileSchema = {
      name: form.getValues().name || "",
      bio: form.getValues().bio || "",
      website: form.getValues().website || "",
      location: form.getValues().location || "",
    };

    const res = await fetch("http://localhost:5001/api/profiles", {
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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => mutate())} className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Add Profile</h3>
          <Button type="submit" className="w-fit rounded-full shadow-lg" disabled={isPending}>
            Save
          </Button>
        </div>

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
