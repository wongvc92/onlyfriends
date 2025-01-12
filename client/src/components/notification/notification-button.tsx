import { IoNotificationsOutline } from "react-icons/io5";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useNotification } from "@/context/notification";

const NotificationButton = () => {
  const { count } = useNotification();

  return (
    <Button type="button" variant="link" className="relative">
      <div
        className={cn(
          "absolute flex  justify-center items-center rounded-full w-4 h-4  top-1 right-1.5 bg-red-500 dark:bg-white text-white dark:text-black text-[10px]",
          count === 0 && "hidden",
          count > 9 && "w-5 right-1.5",
          count > 99 && "w-6 right-0"
        )}
      >
        {count}
      </div>
      <IoNotificationsOutline />
    </Button>
  );
};

export default NotificationButton;
