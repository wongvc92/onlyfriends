import { createFileRoute, Link, Outlet, useLocation, useParams, useRouterState } from "@tanstack/react-router";
import ProfileInfo from "@/components/profile/profile-info";
import PeoplesList from "@/components/people/peoples-list";
import FriendRequestList from "@/components/friend/received-request-list";

export const Route = createFileRoute("/_authenticated/$username/_layout")({
  component: Layout,
});

function Layout() {
  const { username } = useParams({ strict: false });
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

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
    <main className="w-full">
      <div className="flex">
        <div className="w-full xl:w-2/3">
          <section className="w-full">
            <ProfileInfo />
          </section>

          <div className="sticky top-0 z-10 bg-white">
            <nav className="flex items-center gap-2 text-lg border-b p-4 capitalize">
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
        <div className="hidden xl:block xl:w-1/3 border-l md:h-screen sticky top-0 p-4 ">
          <div className="flex flex-col gap-4">
            <div className={`border rounded-md p-2 space-y-4 ${pathname === "/friends/find" ? "hidden" : "block"}`}>
              <div>People you might know</div>
              <PeoplesList />
            </div>
            <div className={`border rounded-md p-2 space-y-4 ${pathname === "/friends/friend-request" ? "hidden" : "block"}`}>
              <div>Friends request</div>
              <FriendRequestList />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
