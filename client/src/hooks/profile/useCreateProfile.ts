import apiClient from "@/utils/apiClient";
import { TProfileSchema } from "@/validation/profileSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileKeys } from "./profileKeys";
import { useNavigate } from "@tanstack/react-router";

const createProfile = async (formData: TProfileSchema) => {
  const body: TProfileSchema = {
    banner_image: formData.banner_image || "",
    display_image: formData.display_image || "",
    name: formData.name || "",
    bio: formData.bio || "",
    website: formData.website || "",
    location: formData.location || "",
  };

  const url = "/api/profiles";
  const res = await apiClient.post(url, body);
  return res.data;
};

export const useCreateProfile = ({ username }: { username?: string }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: `/${username}/add` });
  return useMutation({
    mutationFn: createProfile,
    onError: (error) => toast.error(error.message || "Failed add profile."),
    onSuccess: () => {
      toast.success("Successfully add profile!");
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(username as string) });
      navigate({ to: `/${username}` });
    },
  });
};
