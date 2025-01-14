import apiClient from "@/utils/apiClient";
import { updateNotificationSchema } from "@/validation/notificationSchema";

export interface IUpdateNotificationRespose {
    notificationId: string;
    recipient_id: string;
  }
  export const UpdateNotification = async (notificationId: string): Promise<IUpdateNotificationRespose> => {
    const parsed = updateNotificationSchema.safeParse({ params: { notificationId } });
    if (!parsed.success) {
      throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
    }
    const url = `api/notifications/${parsed.data.params.notificationId}/read`;
    const res = await apiClient.put(url);
    return res.data;
  };