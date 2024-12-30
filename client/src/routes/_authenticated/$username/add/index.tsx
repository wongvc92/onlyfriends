import { createFileRoute } from "@tanstack/react-router";
import AddProfilePage from "@/components/profile/add-profile-page";

export const Route = createFileRoute("/_authenticated/$username/add/")({
  component: AddProfilePage,
});
