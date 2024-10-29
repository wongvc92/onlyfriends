import { checkIfAuthenticated } from "@/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/about/")({
  beforeLoad: async ({ location }) => {
    const data = await checkIfAuthenticated();

    if (!data.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => <div>Hello /about/!</div>,
});
