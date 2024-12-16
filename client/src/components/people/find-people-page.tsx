import PeoplesList from "./peoples-list";
import SearchPeople from "./people-search";

const FindPeoplePage = () => {
  return (
    <div className="space-y-4 px-4">
      <h4 className="font-semibold">Find People</h4>
      <SearchPeople />
      <PeoplesList />
    </div>
  );
};

export default FindPeoplePage;
