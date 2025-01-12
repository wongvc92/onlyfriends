import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { IAuthContext } from "@/context/auth";
import Header from "@/components/common/header";

interface MyRouterContext {
  auth: IAuthContext;
  queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="dark:bg-background">
      <Header />
      <Outlet />
      {/* 
      <TanStackRouterDevtools position="bottom-right" /> */}
    </div>
  );
}
