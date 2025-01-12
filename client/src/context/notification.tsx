import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./socket";
import { useGetUnopenNotification } from "@/hooks/notification/useGetUnopenNotification";
import { useUpdateUnopenNotification } from "@/hooks/notification/useUpdateUnopenNotification";
import { INotificationSocket } from "@/types/INotification";
import { useSetNotificationData } from "@/hooks/notification/useSetNotificationData";

interface INotificationContext {
  onOpenNotification: () => void;
  onCloseNotification: () => void;
  onOpenChange: () => void;
  isOpen: boolean;
  count: number;
}

const NotificationContext = createContext<INotificationContext | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useGetUnopenNotification();
  const { socket } = useSocket();
  const { mutate: updateUnopenNotification } = useUpdateUnopenNotification();
  const { createNotification, updateUnopenNotificationCount, deleteNotification } = useSetNotificationData();

  useEffect(() => {
    if (!socket) return;

    const handleNotificationUpdate = (notification: INotificationSocket) => {
      const { action, notificationData, details } = notification;
      if (action === "increment") {
        updateUnopenNotificationCount({ userId: details.recipient_id, type: "increment" });
        createNotification(details.recipient_id, notificationData);
      } else {
        updateUnopenNotificationCount({ userId: details.recipient_id, type: "decrement" });
        deleteNotification(details.recipient_id, notificationData);
      }
    };

    socket.on("notification_update", handleNotificationUpdate);

    return () => {
      socket.off("notification_update", handleNotificationUpdate);
    };
  }, [socket, data, updateUnopenNotification, updateUnopenNotificationCount, createNotification, deleteNotification]);

  const onOpenNotification = () => setIsOpen(true);

  const onCloseNotification = () => setIsOpen(false);

  const onOpenChange = () => {
    isOpen ? setIsOpen(false) : setIsOpen(true);
    if (data && data.unopen_notification_count > 0) {
      updateUnopenNotification({ user_id: data?.user_id!, type: "reset" });
    }
  };

  const value = { onOpenNotification, onCloseNotification, onOpenChange, isOpen, count: data?.unopen_notification_count || 0 };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
