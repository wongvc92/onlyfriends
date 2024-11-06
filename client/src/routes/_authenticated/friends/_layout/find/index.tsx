import PeoplesList from "@/components/friend/peoples-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/friends/_layout/find/")({
  component: PeoplesList,
});
