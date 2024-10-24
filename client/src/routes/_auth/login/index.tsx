import { LoginForm } from "@/components/auth/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login/")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <LoginForm />
    </div>
  );
}
