import { IGetNotificationsByUserIdResponse } from "@/api/notification/getNotificationsByUserId";
import { IUpdateNotificationRespose } from "@/api/notification/UpdateNotification";
import { notificationKeys } from "@/hooks/notification/notificationKeys";
import { INotification, IUnOpenNotification } from "@/types/INotification";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";

export const useSetNotificationData = () => {
  const queryClient = useQueryClient();

  const createNotification = (userId: string, notificationData: INotification) => {
    queryClient.setQueryData(notificationKeys.userNotifications(userId), (oldData: InfiniteData<IGetNotificationsByUserIdResponse> | undefined) => {
      if (oldData) {
        const newData = oldData.pages.map((page) => ({
          ...page,
          data: [notificationData, ...page.data],
        }));
        return { ...oldData, pages: newData } as InfiniteData<IGetNotificationsByUserIdResponse>;
      }
      return oldData;
    });
  };

  const deleteNotification = (userId: string, notificationData: INotification) => {
    queryClient.setQueryData(notificationKeys.userNotifications(userId), (oldData: InfiniteData<IGetNotificationsByUserIdResponse> | undefined) => {
      if (oldData) {
        const newData = oldData.pages.map((page) => ({
          ...page,
          data: page.data.filter((notification) => notification.id !== notificationData.id),
        }));
        return { ...oldData, pages: newData } as InfiniteData<IGetNotificationsByUserIdResponse>;
      }
      return oldData;
    });
  };

  const updateNotificationReadStatus = (data: IUpdateNotificationRespose) => {
    queryClient.setQueryData(
      notificationKeys.userNotifications(data.recipient_id),
      (oldData: InfiniteData<IGetNotificationsByUserIdResponse> | undefined) => {
        if (oldData) {
          const newData = oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((notification) => (notification.id === data.notificationId ? { ...notification, is_read: true } : notification)),
          }));

          return { ...oldData, pages: newData } as InfiniteData<IGetNotificationsByUserIdResponse>;
        }
        return oldData;
      }
    );
  };

  const updateUnopenNotificationCount = ({ userId, type }: { userId: string; type: "decrement" | "increment" | "reset" }) => {
    queryClient.setQueryData(notificationKeys.userUnopenNofications(userId), (oldData: IUnOpenNotification | undefined) => {
      if (!oldData) return oldData;
      if (type === "decrement") {
        return { ...oldData, unopen_notification_count: Math.max((oldData.unopen_notification_count || 0) - 1, 0) };
      }
      if (type === "increment") {
        return { ...oldData, unopen_notification_count: (oldData.unopen_notification_count || 0) + 1 };
      }
      if (type === "reset") {
        return { ...oldData, unopen_notification_count: 0 };
      }
    });
  };

  return {
    createNotification,
    deleteNotification,
    updateNotificationReadStatus,
    updateUnopenNotificationCount,
  };
};
