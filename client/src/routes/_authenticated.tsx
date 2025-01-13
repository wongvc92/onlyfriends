import { Outlet, redirect } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

import Sidebar from "@/components/common/sidebar";
import WidthWrapper from "@/components/common/width-wrapper";
import MobileNav from "@/components/common/mobile-nav";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location, context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Layout,
});

function Layout() {
  return (
    <WidthWrapper>
      <div className="flex">
        {/* grid 1 */}
        <div className="hidden md:block md:top-[64px] md:h-[calc(100vh-64px)] sticky top-0 border-r p-4 ">
          <Sidebar />
        </div>
        {/* grid 2 */}
        <div className="w-full">
          <Outlet />
        </div>
      </div>

      <MobileNav />
    </WidthWrapper>
  );
}
