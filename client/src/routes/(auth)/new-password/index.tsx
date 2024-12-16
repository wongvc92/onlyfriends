import NewPasswordForm from "@/components/auth/new-password-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/new-password/")({
  component: NewPasswordForm,
});
