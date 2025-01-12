import { useLocation } from "@tanstack/react-router";
import { useAuth } from "@/context/auth";
import MobileNav from "@/components/common/mobile-nav";
import { ModeToggle } from "@/components/common/mode-toggle";
import Notification from "../notification/notification";

const Header = () => {
  const { user } = useAuth();
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  return (
    <div className=" w-full flex items-center 2xl:justify-around justify-between p-2   sticky top-0 bg-white dark:bg-background z-10 shadow-md dark:shadow-slate-900">
      {user && user.id ? <MobileNav /> : "onlyfriends"}
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
