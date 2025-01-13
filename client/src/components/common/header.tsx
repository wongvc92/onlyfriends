import { useLocation } from "@tanstack/react-router";
import { useAuth } from "@/context/auth";
import { ModeToggle } from "@/components/common/mode-toggle";
import Notification from "../notification/notification";
import MobileSidebar from "./mobile-sidebar";

const Header = () => {
  const { user } = useAuth();
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  return (
    <div className=" w-full flex items-center 2xl:justify-around justify-between p-2   md:sticky md:top-0 bg-white dark:bg-background z-20 shadow-md dark:shadow-slate-900">
      {user && user.id ? <MobileSidebar /> : "onlyfriends"}
      <div className="hidden md:block">LOGO</div>
      <div>
        <h1 className="truncate ...">{pathname.split("/")[1].toLocaleUpperCase()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Notification />
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
