import PendingSetRequest from "@/components/friend/pending-sent-request";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/friends/_layout/pending-request/")({
  component: PendingSetRequest,
});
