import { createFileRoute, useLocation } from "@tanstack/react-router";
import AllPostList from "@/components/post/all-post-list";
import { useState } from "react";
import PostModal from "@/components/post/post-modal";
import { ImageIcon } from "@radix-ui/react-icons";
import PeoplesList from "@/components/friend/peoples-list";
import FriendRequestList from "@/components/friend/friend-request-list";

export const Route = createFileRoute("/_authenticated/home/")({
  component: HomePage,
});

function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 ">
      <div className="md:col-span-2  py-4 ">
        <div
          className="flex items-center justify-between border rounded-md p-4 text-muted-foreground mx-4"
          onClick={() => setIsOpen(true)}
        >
          what's on your mind... <ImageIcon />
        </div>
        <PostModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <AllPostList />
      </div>

      <div className="hidden border-l md:col-span-1 lg:block sticky top-0 p-4">
        <div className="flex flex-col gap-4">
          <div
            className={`border rounded-md p-2 space-y-4 ${pathname === "/friends/find" ? "hidden" : "block"}`}
          >
            <div>People you might know</div>
            <PeoplesList />
          </div>
          <div
            className={`border rounded-md p-2 space-y-4 ${pathname === "/friends/friend-request" ? "hidden" : "block"}`}
          >
            <div>Friends request</div>
            <FriendRequestList />
          </div>
        </div>
      </div>
    </section>
  );
}
