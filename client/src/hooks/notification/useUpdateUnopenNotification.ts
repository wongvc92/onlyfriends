import apiClient from "@/utils/apiClient";
import { updateUnopenNotificationSchema } from "@/validation/notificationSchema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";
import { useSetNotificationData } from "./useSetNotificationData";

const UpdateUnopenNotification = async ({ user_id, type }: { user_id: string; type: "increment" | "decrement" | "reset" }) => {
  const parsed = updateUnopenNotificationSchema.safeParse({ params: { user_id }, body: { type } });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }

  const url = `api/notifications/${parsed.data.params.user_id}/unopen`;
  const res = await apiClient.put(url, { type });
  return res.data;
};

export const useUpdateUnopenNotification = () => {
  const { user } = useAuth();
  const { updateUnopenNotificationCount } = useSetNotificationData();
  return useMutation({
    mutationFn: UpdateUnopenNotification,
    onError: (data) => {
      console.log("error", data);
      toast.error("something went wrong, please try again later.");
    },
    onSuccess: () => {
      updateUnopenNotificationCount({ userId: user?.id as string, type: "reset" });
    },
  });
};
