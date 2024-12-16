import List from "@/components/conversation/conversation-list";
import Search from "@/components/conversation/search-conversation";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/messages/_layout")({
  component: Layout,
});

function Layout() {
  return (
    <section className="flex border-r">
      <div className="w-full lg:max-w-xs py-4 overflow-y-auto">
        <p className="pb-4 px-4">Messages</p>
        <Search />
        <List />
      </div>

      <div className="hidden  border-l  lg:block h-screen w-full">
        <Outlet />
      </div>
    </section>
  );
}
