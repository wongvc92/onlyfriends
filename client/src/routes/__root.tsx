import { Link, Outlet, createRootRouteWithContext, useMatch, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IAuthContext, useAuth } from "@/auth";
import LogoutButton from "@/components/auth/logout-button";

interface MyRouterContext {
  auth: IAuthContext;
  queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const auth = useAuth();
  return (
    <div className="container mx-auto">
      <Outlet />

      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
