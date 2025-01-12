import apiClient from "@/utils/apiClient";
import { INotification } from "@/types/INotification";
import { getNotificationSchema } from "@/validation/notificationSchema";
import { buildSearchParams } from "@/utils/buildSearchParams";

export interface IGetNotificationsByUserIdResponse {
  data: INotification[];
  currentPage: number;
  nextPage: number;
}

export const getNotificationsByUserId = async ({
  pageParam,
  user_id,
}: {
  pageParam: number;
  user_id: string;
}): Promise<IGetNotificationsByUserIdResponse> => {
  const LIMIT = 10;

  const parsed = getNotificationSchema.safeParse({ params: { user_id }, query: { page: pageParam, limit: LIMIT } });

  if (!parsed.success) {
    console.log(parsed.error.issues);
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }

  const url =
    `/api/notifications/${parsed.data.params.user_id}` + buildSearchParams({ page: parsed.data.query.page, limit: parsed.data.query.limit });
  const res = await apiClient.get(url);

  return res.data;
};
