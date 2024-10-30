import { createFileRoute, Link, Outlet, useParams, useRouterState } from "@tanstack/react-router";
import Banner from "./-components/banner";
import PostCard from "./-components/post-card";

export const Route = createFileRoute("/_authenticated/$username/_layout")({
  component: Layout,
});

function Layout() {
  const { username } = useParams({ strict: false });
  const NAV_LINKS = [
    {
      label: "posts",
      path: `/${username}/posts`,
    },
    {
      label: "media",
      path: `/${username}/media`,
    },
  ];

  return (
    <div className="w-full">
      <section className="w-full">
        <Banner />
      </section>
      <div className="sticky top-0 z-10 bg-white">
        <nav className="flex items-center gap-2 text-lg border-b p-2 capitalize">
          {NAV_LINKS.map((nav) => {
            const {
              location: { pathname },
            } = useRouterState();
            const isActive = pathname === nav.path;
            return (
              <Link key={nav.label} to={nav.path} className={`text-right ${isActive && "font-bold"}`} activeOptions={{ exact: true }}>
                {nav.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
