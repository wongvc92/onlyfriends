import ReceivedRequestPage from "@/components/friend/received-request-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/friends/_layout/friend-request/")({
  component: ReceivedRequestPage,
});
