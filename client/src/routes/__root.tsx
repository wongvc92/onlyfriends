import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/register"
            activeProps={{
              className: "font-bold",
            }}
          >
            Register
          </Link>
        </div>
        <hr />
        <div className="px-2">
          <Outlet />
        </div>
        <Toaster />
      </QueryClientProvider>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
