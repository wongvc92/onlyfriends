import apiClient from "@/utils/apiClient";
import { updateUnopenNotificationSchema } from "@/validation/notificationSchema";

export const UpdateUnopenNotification = async ({ user_id, type }: { user_id: string; type: "increment" | "decrement" | "reset" }) => {
  const parsed = updateUnopenNotificationSchema.safeParse({ params: { user_id }, body: { type } });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }

  const url = `api/notifications/${parsed.data.params.user_id}/unopen`;
  const res = await apiClient.put(url, { type });
  return res.data;
};
