import { Outlet, createRootRouteWithContext, useLocation } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { IAuthContext } from "@/context/auth";
import MobileNav from "@/components/common/mobile-nav";

interface MyRouterContext {
  auth: IAuthContext;
  queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  return (
    <div>
      <div className="flex items-center justify-between p-2 w-full md:hidden ">
        <MobileNav />
        <div>
          <h1 className="truncate ...">{pathname.split("/")[1].toLocaleUpperCase()}</h1>
        </div>
        <div>Dark mode</div>
      </div>
      <Outlet />
      {/* 
      <TanStackRouterDevtools position="bottom-right" /> */}
    </div>
  );
}
