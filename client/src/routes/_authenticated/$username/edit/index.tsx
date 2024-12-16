import { createFileRoute } from "@tanstack/react-router";
import EditProfilePage from "@/components/profile/edit-profile-page";

export const Route = createFileRoute("/_authenticated/$username/edit/")({
  component: EditProfilePage,
});
