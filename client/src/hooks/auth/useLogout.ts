import apiClient from "@/utils/apiClient";
import { basePath } from "@/utils/basePath";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "./authKeys";
import { toast } from "sonner";

const logout = async () => {
  const url = basePath("/api/auth/logout");
  const res = await apiClient.post(url);
  return res.data;
};

export const useLogout = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      window.location.href = "/";
      query.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error: any) => {
      console.error("Logout error:", error);
      toast.error(error.message || "Failed to logout");
    },
  });
};
