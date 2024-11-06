import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/friends/")({
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({
      to: "/friends/list",
      replace: true,
    });
  }, [navigate]);
}
