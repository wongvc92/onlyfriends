import { basePath } from "@/utils/basePath";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authKeys } from "./authKeys";
import { TLoginUserSchema } from "@/validation/authSchema";

const login = async (formData: TLoginUserSchema) => {
  const url = basePath("/api/auth/login");
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to log in");
  }
  const data = await res.json();
  return data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/login" });
  return useMutation({
    mutationFn: (formData: TLoginUserSchema) => login(formData),
    onSuccess: (data) => {
      if (data.twoFactor === true) {
        navigate({ search: (prev) => ({ ...prev, showTwoFactor: "true" }) });
        toast.success("Please check email for two factor code");
      }
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    },
  });
};
