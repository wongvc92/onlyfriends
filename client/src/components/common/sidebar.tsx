import Nav from "./nav";

const Sidebar = () => {
  return (
    <aside className="flex flex-col items-center ">
      <h3 className="text-center pb-4 md:hidden">LOGO</h3>
      <Nav />
    </aside>
  );
};

export default Sidebar;
