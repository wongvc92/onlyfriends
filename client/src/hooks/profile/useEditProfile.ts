import apiClient from "@/utils/apiClient";
import { TProfileSchema } from "@/validation/profileSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

const editProfile = async (formData: TProfileSchema) => {
  console.log("formData", formData);
  if (!formData?.id) return;
  const url = `/api/profiles/${formData.id}`;
  const res = await apiClient.put(url, formData);
  return res.data;
};

export const useEditProfile = ({ username }: { username?: string }) => {
  const navigate = useNavigate({ from: `/${username}/edit` });
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      navigate({ to: `/${username}` });
    },
  });
};
