import NewPasswordPage from "@/components/auth/new-password-page";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const newPasswordSchema = z.object({
  token: z.string().optional().catch(""),
});

type TNewPassword = z.infer<typeof newPasswordSchema>;

export const Route = createFileRoute("/(auth)/new-password/")({
  validateSearch: newPasswordSchema,
  component: NewPasswordPage,
});
