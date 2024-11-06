import { createFileRoute } from "@tanstack/react-router";
import EditProfileForm from "../../../../components/profile/edit-profile-form";

export const Route = createFileRoute("/_authenticated/$username/edit/")({
  component: EditProfile,
});

function EditProfile() {
  return (
    <div>
      <EditProfileForm />
    </div>
  );
}
