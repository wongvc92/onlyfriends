import apiClient from "@/utils/apiClient";
import { IUnOpenNotification } from "@/types/INotification";
import { getUnopenNotificationByRecipientIdSchema } from "@/validation/notificationSchema";

export const getUnopenNotification = async ({ user_id }: { user_id: string }): Promise<IUnOpenNotification> => {
  const parsed = getUnopenNotificationByRecipientIdSchema.safeParse({ params: { user_id } });

  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }

  const url = `/api/notifications/${parsed.data.params.user_id}/unopen`;
  const res = await apiClient.get(url);

  return res.data.unopenNotification;
};
