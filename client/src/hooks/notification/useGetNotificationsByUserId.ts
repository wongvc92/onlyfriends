import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotificationsByUserId } from "@/api/notification/getNotificationsByUserId";
import { useAuth } from "@/context/auth";
import { notificationKeys } from "./notificationKeys";

export const useGetNotificationsByUserId = () => {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: notificationKeys.userNotifications(user?.id as string),
    queryFn: ({ pageParam }) => getNotificationsByUserId({ pageParam, user_id: user?.id as string }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!user?.id,
  });
};
