import { checkIfAuthenticated } from "@/auth";
import LogoutButton from "@/components/auth/logout-button";
import { Link, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { createFileRoute, useRouterState } from "@tanstack/react-router";

const NAV_LINKS = [
  {
    label: "home",
    path: "/home",
  },
  {
    label: "about",
    path: "/about",
  },
  {
    label: "profile",
    path: "/profile",
  },
  {
    label: "posts",
    path: "/posts",
  },
];

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
                <Link key={nav.label} to={nav.path} className={`text-right ${isActive && "font-bold"}`} activeOptions={{ exact: true }}>
                  {nav.label}
                </Link>
              );
            })}
            <LogoutButton />
          </nav>
        </aside>
        <div className="p-4 w-full border md:col-span-2">
          <Outlet />
        </div>
        <div className="hidden md:block md:col-span-1 md:h-screen sticky top-0 p-4">test</div>
      </div>
    </div>
  );
}
