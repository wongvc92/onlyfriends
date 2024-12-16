import SentRequestPage from "@/components/friend/sent-request-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/friends/_layout/pending-request/")({
  component: SentRequestPage,
});
