import { Outlet, createRootRouteWithContext, useMatch, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient } from "@tanstack/react-query";
import { IAuthContext, useAuth } from "@/auth";

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
    <div>
      <Outlet />

      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
