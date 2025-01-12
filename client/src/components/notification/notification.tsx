import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import NotificationButton from "./notification-button";
import NotificationList from "./notification-list";
import { useNotification } from "@/context/notification";

const Notification = () => {
  const { isOpen, onOpenChange, onOpenNotification } = useNotification();

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger onClick={onOpenNotification}>
        <NotificationButton />
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <NotificationList />
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
