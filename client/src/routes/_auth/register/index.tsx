import RegisterForm from "@/components/auth/register-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/register/")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="mx-auto max-w-md">
      <RegisterForm />
    </div>
  );
}
