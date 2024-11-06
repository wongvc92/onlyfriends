import FriendRequestList from "@/components/friend/friend-request-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/friends/_layout/friend-request/")({
  component: FriendRequestList,
});
