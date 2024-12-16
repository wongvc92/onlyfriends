import { Input } from "../ui/input";
import { FaSearch } from "react-icons/fa";
import { useSearchPeople } from "@/hooks/people/useSearchPeople";
import { useGetPeoples } from "@/hooks/people/useGetpeoples";

const PeopleSearch = () => {
  const { query, setQuery } = useSearchPeople();
  const { data } = useGetPeoples();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  if (data?.pages[0].data.length === 0) return null;

  return (
    <div className="relative">
      <Input value={query} onChange={onChange} className="max-w-xs pl-10 rounded-full" placeholder="Search people..." />
      <FaSearch className="absolute top-3 left-3" />
    </div>
  );
};

export default PeopleSearch;
