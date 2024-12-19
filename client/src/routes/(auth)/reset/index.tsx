import ResetPasswordPage from "@/components/auth/reset-password-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/reset/")({
  component: ResetPasswordPage,
});
