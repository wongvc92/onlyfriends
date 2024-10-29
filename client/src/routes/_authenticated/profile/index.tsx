import { checkIfAuthenticated } from "@/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile/")({
  component: () => <div>Hello /profile/!</div>,
});
