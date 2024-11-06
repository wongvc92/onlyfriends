import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/friends/_layout")({
  component: Layout,
});

function Layout() {
  const NAV_LINKS = [
    {
      label: "friends",
      path: "/friends/list",
    },
    {
      label: "request",
      path: "/friends/friend-request",
    },
    {
      label: "pending",
      path: "/friends/pending-request",
    },
    {
      label: "find",
      path: "/friends/find",
    },
  ];

  return (
    <>
      <div className="sticky top-0 z-10 bg-white">
        <nav className="flex items-center gap-4 text-lg border-b p-2 capitalize">
          {NAV_LINKS.map((nav) => {
            const {
              location: { pathname },
            } = useRouterState();
            const isActive = pathname === nav.path;
            return (
              <Link
                key={nav.label}
                to={nav.path}
                className={`text-sm ${isActive && "font-bold bg-muted py-1 px-2 rounded-full"}`}
                activeOptions={{ exact: true }}
              >
                {nav.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="py-2">
        <Outlet />
      </div>
    </>
  );
}
