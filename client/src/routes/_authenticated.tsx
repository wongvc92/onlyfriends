import { checkIfAuthenticated, useAuth } from "@/auth";
import LogoutButton from "@/components/auth/logout-button";
import { Link, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { IoHomeOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import PeoplesList from "@/components/peoples-list";
import FriendRequest from "@/components/friend-request";
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
    <div className="border mx-auto max-w-5xl">
      <div className="grid grid-cols-1 sm:grid-cols-8">
        {/* grid 1 */}
        <aside className="col-span-1 md:border-r md:h-screen p-4 capitalize hidden md:block sticky top-0">
          <nav className="flex flex-col gap-2 text-lg ">
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
                  <span>{nav.icon}</span>
                  <p className="hidden xl:block">{nav.label}</p>
                </Link>
              );
            })}
            <LogoutButton />
          </nav>
        </aside>

        {/* grid 2 */}
        <div className="p-4 sm:col-span-6 md:col-span-6 lg:col-span-4">
          <Outlet />
        </div>

        {/* grid 3 */}
        <div className="hidden lg:block sm:col-span-3  md:h-screen sticky top-0 p-4 border-l">
          <div className="flex flex-col gap-4 ">
            <PeoplesList />
            <FriendRequest />
            <div className="border rounded-md p-2">test</div>
          </div>
        </div>
      </div>
    </div>
  );
}
