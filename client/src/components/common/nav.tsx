import { Link, useRouterState } from "@tanstack/react-router";
import { CgMail, CgProfile } from "react-icons/cg";
import { FaUserFriends } from "react-icons/fa";
import { IoHomeOutline, IoNotificationsOutline } from "react-icons/io5";
import LogoutButton from "../auth/logout-button";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";

const Nav = ({ isMobileNav = false, onClose }: { isMobileNav?: boolean; onClose?: () => void }) => {
  const { user } = useAuth();
  const NAV_LINKS = [
    {
      label: "home",
      path: "/home",
      icon: <IoHomeOutline />,
    },
    {
      label: "profile",
      path: `/${user?.username}`,
      icon: <CgProfile />,
    },
    {
      label: "friends",
      path: "/friends",
      icon: <FaUserFriends />,
    },
    {
      label: "messages",
      path: "/messages",
      icon: <CgMail />,
    },
    {
      label: "notifications",
      path: "/notifications",
      icon: <IoNotificationsOutline />,
    },
  ];

  return (
    <div className="h-full">
      <div>
        <nav className="flex flex-col gap-2 text-lg items-start">
          {NAV_LINKS.map((nav) => {
            const {
              location: { pathname },
            } = useRouterState();
            const isActive = nav.path.split("/")[1] === pathname.split("/")[1];
            return (
              <Link
                key={nav.label}
                to={nav.path}
                className={cn(
                  `flex items-center w-full py-4 px-4 rounded-full lg:py-1 lg:px-4 lg:rounded-md capitalize hover:bg-muted gap-2 text-left`,
                  isActive && "font-bold bg-muted"
                )}
                activeOptions={{ exact: true }}
                onClick={onClose}
              >
                <span>{nav.icon}</span>
                <p className={cn("hidden lg:block", isMobileNav && "block")}>{nav.label}</p>
              </Link>
            );
          })}
        </nav>
      </div>
      <div>
        <div className="pt-4 md:pl-0 lg:pl-4">
          <LogoutButton isMobileNav={isMobileNav} />
        </div>
      </div>
    </div>
  );
};

export default Nav;
