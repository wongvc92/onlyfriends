import AcceptedFriendList from "@/components/friend/accepted-friend-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/friends/_layout/list/")({
  component: AcceptedFriendList,
});
