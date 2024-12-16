import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { IAuthContext } from "@/context/auth";

interface MyRouterContext {
  auth: IAuthContext;
  queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div>
      <Outlet />
      {/* 
      <TanStackRouterDevtools position="bottom-right" /> */}
    </div>
  );
}
