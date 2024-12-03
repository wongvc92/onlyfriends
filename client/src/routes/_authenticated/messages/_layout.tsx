import List from "@/components/conversation/list";
import Search from "@/components/conversation/seach";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/messages/_layout")({
  component: Layout,
});

function Layout() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-5 border-r">
      <div className="md:col-span-2 py-4 overflow-y-auto">
        <p className="pb-4 px-4">Messages</p>
        <Search />
        <List />
      </div>

      <div className="hidden  border-l md:col-span-3 lg:block h-screen">
        <Outlet />
      </div>
    </section>
  );
}
