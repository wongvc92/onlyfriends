import { basePath } from "@/utils/basePath";
import { TNewPasswordSchema } from "@/validation/newPasswordSchema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const newPassword = async (newPasswordData: TNewPasswordSchema) => {
  const url = basePath("/api/auth/new-password");
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPasswordData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error changing password");
  }
  const data = await res.json();
  return data;
};

const useNewPassword = () => {
  return useMutation({
    mutationFn: newPassword,
    onSuccess: (data) => {
      toast.success("Password changed successfully");
      console.log("Password changed successfully:", data);
    },
    onError: (error) => {
      toast.error("Error changing password");
      console.error("Error changing password:", error.message);
    },
  });
};

export default useNewPassword;
