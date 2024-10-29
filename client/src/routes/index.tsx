import { checkIfAuthenticated } from "@/auth";
// import { LoginForm } from "@/components/auth/login-form";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ location, context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    } else {
      throw redirect({
        to: "/home",
      });
    }
  },
});
