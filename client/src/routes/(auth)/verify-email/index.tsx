import VerifyEmailPage from "@/components/auth/verify-email-page";
import { createFileRoute } from "@tanstack/react-router";

type VerifyEmailParams = {
  token: string;
};
export const Route = createFileRoute("/(auth)/verify-email/")({
  validateSearch: (search: Record<string, unknown>): VerifyEmailParams => {
    return {
      token: (search.token as string) || "",
    };
  },
  component: VerifyEmailPage,
});
