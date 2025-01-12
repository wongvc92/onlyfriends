import NotificationPage from "@/components/notification/notification-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/notifications/")({
  component: NotificationPage,
});
