import { Button } from "../ui/button";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/auth";
import { useState } from "react";

const LogoutButton = () => {
  const { logoutUser, authState } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  console.log("LogoutButton", authState);
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsPending(true);
    await logoutUser();
    setIsPending(false);
    await router.invalidate();
    await navigate({ to: "/login" });
  };
  return (
    <Button type="button" onClick={onSubmit} disabled={isPending}>
      Logout
    </Button>
  );
};

export default LogoutButton;
