import { checkIfAuthenticated, useAuth } from "@/auth";
import LogoutButton from "@/components/auth/logout-button";
import { Link, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { IoHomeOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
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
  const { user } = useAuth();
  const NAV_LINKS = [
    {
      label: "home",
      path: "/home",
      icon: <IoHomeOutline />,
    },

    {
      label: "profile",
      path: `/${user?.username}`,
      icon: <CgProfile />,
    },
  ];

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4">
        <aside className="md:border-r md:h-screen p-4 capitalize hidden md:block md:col-span-1 sticky top-0">
          <nav className="flex flex-col items-end gap-2 text-lg">
            {NAV_LINKS.map((nav) => {
              const {
                location: { pathname },
              } = useRouterState();
              const isActive = nav.path.split("/")[1] === pathname.split("/")[1];
              return (
                <Link
                  key={nav.label}
                  to={nav.path}
                  className={`flex items-center gap-2 text-left  ${isActive && "font-bold"}`}
                  activeOptions={{ exact: true }}
                >
                  {nav.icon}
                  {nav.label}
                </Link>
              );
            })}
            <LogoutButton />
          </nav>
        </aside>
        <div className="p-4 w-full md:col-span-2">
          <Outlet />
        </div>
        <div className="hidden md:block md:col-span-1 md:h-screen sticky top-0 p-4 border-l">test</div>
      </div>
    </div>
  );
}
