import { useAuth } from "@/auth";
import LogoutButton from "@/components/auth/logout-button";
import { Link, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { IoHomeOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaUserFriends } from "react-icons/fa";


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
    {
      label: "friends",
      path: "/friends",
      icon: <FaUserFriends />,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 sm:grid-cols-8">
        {/* grid 1 */}
        <aside className="border-r col-span-1 md:h-screen p-4 capitalize hidden md:flex flex-col items-center sticky top-0">
          <h3 className="text-center pb-4">LOGO</h3>
          <nav className="flex flex-col gap-6 text-lg items-center">
            {NAV_LINKS.map((nav) => {
              const {
                location: { pathname },
              } = useRouterState();
              const isActive =
                nav.path.split("/")[1] === pathname.split("/")[1];
              return (
                <Link
                  key={nav.label}
                  to={nav.path}
                  className={`flex items-center gap-2 text-left ${
                    isActive && "font-bold"
                  }`}
                  activeOptions={{ exact: true }}
                >
                  <span>{nav.icon}</span>
                  <p className="hidden sm:block">{nav.label}</p>
                </Link>
              );
            })}
            <LogoutButton />
            <p className="text-xs">@{user?.username}</p>
          </nav>
        </aside>

        {/* grid 2 */}
        <div className="col-span-7 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
