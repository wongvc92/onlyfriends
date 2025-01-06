import { Outlet, createRootRouteWithContext, useLocation } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { IAuthContext, useAuth } from "@/context/auth";
import MobileNav from "@/components/common/mobile-nav";
import { ModeToggle } from "@/components/common/mode-toggle";

interface MyRouterContext {
  auth: IAuthContext;
  queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { user } = useAuth();
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  return (
    <div className="dark:bg-background">
      <div className="flex items-center justify-between p-2 w-full md:hidden ">
        {user && user.id ? <MobileNav /> : "onlyfriends"}
        <div>
          <h1 className="truncate ...">{pathname.split("/")[1].toLocaleUpperCase()}</h1>
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
      <Outlet />
      {/* 
      <TanStackRouterDevtools position="bottom-right" /> */}
    </div>
  );
}
