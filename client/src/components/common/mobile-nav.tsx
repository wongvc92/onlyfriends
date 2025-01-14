import { Link, useRouterState } from "@tanstack/react-router";
import { CgMail, CgProfile } from "react-icons/cg";
import { FaUserFriends } from "react-icons/fa";
import { IoHomeOutline, IoNotificationsOutline } from "react-icons/io5";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";
import { useScrollStatus } from "@/hooks/common/useScrollStatus";
import { useNotification } from "@/context/notification";
import { useUpdateUnopenNotification } from "@/hooks/notification/useUpdateUnopenNotification";

const MobileNav = () => {
  const { user } = useAuth();
  const { isScrolling } = useScrollStatus(300);
  const { count } = useNotification();
  const { mutate } = useUpdateUnopenNotification();

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!user) return;
    mutate({ type: "reset", user_id: user.id });
  };

  const NAV_LINKS = [
    {
      label: "home",
      path: "/home",
      icon: <IoHomeOutline />,
      count: 0,
    },
    {
      label: "profile",
      path: `/${user?.username}`,
      icon: <CgProfile />,
      count: 0,
    },
    {
      label: "friends",
      path: "/friends",
      icon: <FaUserFriends />,
      count: 0,
    },
    {
      label: "messages",
      path: "/messages",
      icon: <CgMail />,
      count: 0,
    },
    {
      label: "notifications",
      path: "/notifications",
      icon: <IoNotificationsOutline />,
      count: count,
    },
  ];

  return (
    <div
      className={cn(
        "fixed bottom-2 w-full py-2 transition-all duration-500 ease-in-out transform md:hidden border rounded-full",
        isScrolling ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100",
        "dark:bg-background bg-white"
      )}
    >
      <nav className="flex justify-around">
        {NAV_LINKS.map((nav) => {
          const {
            location: { pathname },
          } = useRouterState();
          const isActive = nav.path.split("/")[1] === pathname.split("/")[1];
          return (
            <Link
              key={nav.label}
              to={nav.path}
              className={cn(`py-2 px-2 rounded-full hover:bg-muted relative`, isActive && "font-bold bg-muted")}
              activeOptions={{ exact: true }}
              onClick={handleNavClick}
            >
              <span>{nav.icon}</span>
              {nav.count > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[12px] px-1.5 py-0.5 font-light rounded-full">{nav.count}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNav;
