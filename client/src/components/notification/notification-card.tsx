import { useNotification } from "@/context/notification";
import { useUpdateNotification } from "@/hooks/notification/useUpdateNotification";
import { cn } from "@/lib/utils";
import { INotification } from "@/types/INotification";
import { Link } from "@tanstack/react-router";

const NotificationCard = ({ notification }: { notification: INotification }) => {
  const { onCloseNotification } = useNotification();
  const { mutate } = useUpdateNotification();

  const onClick = () => {
    onCloseNotification();
    if (!notification.is_read) {
      mutate(notification.id);
    }
  };

  return (
    <div className={cn("p-2 hover:bg-muted", notification.is_read === true ? "bg-none" : "bg-muted")}>
      <Link to={"/posts/$postId"} params={{ postId: notification.source_id }} key={notification.id} onClick={onClick}>
        <p className="text-xs">{notification.content}</p>
      </Link>
    </div>
  );
};

export default NotificationCard;
