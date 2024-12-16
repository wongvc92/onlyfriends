import { createFileRoute } from "@tanstack/react-router";
import EditProfileForm from "../../../../components/profile/add-profile-form";

export const Route = createFileRoute("/_authenticated/$username/add/")({
  component: EditProfileForm,
});
