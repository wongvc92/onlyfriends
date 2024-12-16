import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { redirect } from "@tanstack/react-router";
import LoginPage from "@/components/auth/login-page";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const fallback = "/home" as const;

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
    showTwoFactor: z.string().optional(),
  }),

  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: LoginPage,
});
