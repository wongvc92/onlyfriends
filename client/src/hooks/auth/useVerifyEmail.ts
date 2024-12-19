import { basePath } from "@/utils/basePath";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const verifyEmailByToken = async (token: string) => {
  const url = basePath("/api/auth/verify-email");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    return errorData;
  }
  return await res.json();
};

export const useVerifyEmail = () => {
  const navigate = useNavigate({ from: "/verify-email" });

  return useMutation({
    mutationFn: verifyEmailByToken,
    onSuccess: (data) => {
      toast.success(data.message || "Successfully verified!");
      navigate({ to: "/login" });
    },
    onError: (data) => {
      toast.error(data.message || "verification failed.");
    },
  });
};
