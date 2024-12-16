import { Outlet, redirect } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

import Sidebar from "@/components/common/sidebar";
import WidthWrapper from "@/components/common/width-wrapper";

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
        <div className="hidden md:block md:h-screen sticky top-0 border-r p-4 ">
          <Sidebar />
        </div>
        {/* grid 2 */}
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </WidthWrapper>
  );
}
