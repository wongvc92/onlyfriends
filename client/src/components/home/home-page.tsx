import { ImageIcon } from "@radix-ui/react-icons";
import { useLocation } from "@tanstack/react-router";
import { useState } from "react";
import PostModal from "../post/post-modal";
import AllPostList from "../post/all-post-list";
import PeoplesList from "../people/peoples-list";
import FriendRequestList from "../friend/received-request-list";

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  return (
    <main className="flex">
      <div className="w-full py-4 xl:w-2/3">
        <div className="flex items-center justify-between border rounded-md p-4 text-muted-foreground mx-4" onClick={() => setIsOpen(true)}>
          what's on your mind... <ImageIcon />
        </div>
        <PostModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <AllPostList />
      </div>

      <div className="hidden xl:block border-l xl:w-1/3  xl:h-screen sticky top-0 p-4">
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
    </main>
  );
};

export default HomePage;
