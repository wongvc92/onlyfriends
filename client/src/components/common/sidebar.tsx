import { useAuth } from "@/context/auth";
import { Link, useRouterState } from "@tanstack/react-router";
import { CgMail, CgProfile } from "react-icons/cg";
import { FaUserFriends } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import LogoutButton from "../auth/logout-button";

const Sidebar = () => {
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
  ];
  return (
    <aside className="flex flex-col items-center ">
      <h3 className="text-center pb-4">LOGO</h3>
      <nav className="flex flex-col gap-2 text-lg items-center lg:items-start">
        {NAV_LINKS.map((nav) => {
          const {
            location: { pathname },
          } = useRouterState();
          const isActive = nav.path.split("/")[1] === pathname.split("/")[1];
          return (
            <Link
              key={nav.label}
              to={nav.path}
              className={`flex items-center w-full py-4 px-4 rounded-full  lg:py-1 lg:px-4 lg:rounded-md capitalize hover:bg-muted gap-2 text-left ${isActive && "font-bold bg-muted"}`}
              activeOptions={{ exact: true }}
            >
              <span>{nav.icon}</span>
              <p className="hidden lg:block">{nav.label}</p>
            </Link>
          );
        })}
        <LogoutButton />
      </nav>
    </aside>
  );
};

export default Sidebar;
