import { useGetNotificationsByUserId } from "@/hooks/notification/useGetNotificationsByUserId";
import NotificationLink from "./notification-card";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import Spinner from "../ui/spinner";
import { useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const NotificationList = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } = useGetNotificationsByUserId();
  const { ref, inView } = useInView();

  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (status === "pending") return <Spinner />;

  if (status === "error") return <h1>{`An error has occurred: " + ${error.message}`}</h1>;

  if (data.pages[0].data.length === 0) return <div className="p-2 text-xs">No notification at the moment</div>;

  return (
    <div className={cn("h-[60vh] ", pathname.startsWith("/notifications") ? "overscroll-y-none" : "overflow-y-scroll")}>
      {data.pages.map((page) => (
        <>
          {page.data.map((notification) => (
            <NotificationLink key={notification.id} notification={notification} />
          ))}
        </>
      ))}
      <div className="text-[12px] flex justify-center text-muted-foreground py-1">
        <button ref={ref} onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
          {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load Newer" : "Nothing more to load"}
        </button>
      </div>
    </div>
  );
};

export default NotificationList;
