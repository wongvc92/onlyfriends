import AcceptedList from "./accepted-list";
import AcceptedListSearch from "./accepted-list-search";

const AcceptedListPage = () => {
  return (
    <div className="space-y-4 px-4 h-screen">
      <h4 className="font-semibold">Friends List</h4>
      <AcceptedListSearch />
      <AcceptedList />
    </div>
  );
};

export default AcceptedListPage;
