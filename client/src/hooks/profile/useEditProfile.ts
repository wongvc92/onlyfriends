import apiClient from "@/utils/apiClient";
import { TProfileSchema } from "@/validation/profileSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

const editProfile = async (formData: TProfileSchema) => {
  if (!formData?.id) return;
  const url = `/api/profiles/${formData.id}`;
  const res = await apiClient.put(url, formData);
  return res.data;
};

export const useEditProfile = ({ username }: { username?: string }) => {
  const navigate = useNavigate();
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
