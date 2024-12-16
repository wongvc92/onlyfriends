import ProfilePage from "@/components/profile/profile-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/$username/")({
  component: ProfilePage,
});
