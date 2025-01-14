import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSetNotificationData } from "./useSetNotificationData";
import { UpdateNotification } from "@/api/notification/UpdateNotification";

export const useUpdateNotification = () => {
  const { updateNotificationReadStatus } = useSetNotificationData();
  return useMutation({
    mutationFn: UpdateNotification,
    onError: () => toast.error("Failed to update notification."),
    onSuccess: (data) => updateNotificationReadStatus(data),
  });
};
