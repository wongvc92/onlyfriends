import { Button } from "../ui/button";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";

const LogoutButton = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const logoutUser = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    // setAuthState({ isAuthenticated: false, user: null });
  };

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsPending(true);
    await logoutUser();
    setIsPending(false);
    await router.invalidate();
    window.location.href = "/login";
  };
  return (
    <Button type="button" onClick={onSubmit} disabled={isPending}>
      Logout
    </Button>
  );
};

export default LogoutButton;
