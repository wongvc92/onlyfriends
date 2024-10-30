import { createFileRoute, redirect, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/$username/")({
  component: Page,
});

function Page() {
  const { username } = useParams({ strict: false });
  const navigate = useNavigate();
  useEffect(() => {
    navigate({
      to: `/${username}/posts`,
      replace: true,
    });
  }, [username, navigate]);

  return (
    <div>
      {/* Fallback or main content for the user profile page */}
      <h1>Welcome to {username}'s profile!</h1>
    </div>
  );
}
