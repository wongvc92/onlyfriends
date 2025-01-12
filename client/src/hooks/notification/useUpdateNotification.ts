import apiClient from "@/utils/apiClient";
import { updateNotificationSchema } from "@/validation/notificationSchema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSetNotificationData } from "./useSetNotificationData";

export interface IUpdateNotificationRespose {
  notificationId: string;
  recipient_id: string;
}
const UpdateNotification = async (notificationId: string): Promise<IUpdateNotificationRespose> => {
  const parsed = updateNotificationSchema.safeParse({ params: { notificationId } });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }
  const url = `api/notifications/${parsed.data.params.notificationId}/read`;
  const res = await apiClient.put(url);
  return res.data;
};
export const useUpdateNotification = () => {
  const { updateNotificationReadStatus } = useSetNotificationData();
  return useMutation({
    mutationFn: UpdateNotification,
    onError: () => toast.error("Failed to update notification."),
    onSuccess: (data) => updateNotificationReadStatus(data),
  });
};
