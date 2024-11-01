import RegisterForm from "@/components/auth/register-form";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/register/")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="mx-auto max-w-md">
      <RegisterForm />
    </div>
  );
}
