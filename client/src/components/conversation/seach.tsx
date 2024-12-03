import { Input } from "../ui/input";
import { FaSearch } from "react-icons/fa";
import { useSearchConversation } from "@/hooks/conversation/useSearchConverstations";

const Search = () => {
  const { inputValue, setInputValue } = useSearchConversation();
  
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
  };
  return (
    <div className="relative p-4">
      <Input
        placeholder="Search Direct Messages"
        className="pl-10 rounded-full"
        onChange={onInputChange}
        value={inputValue}
      />
      <FaSearch className="absolute top-6 left-7" />
    </div>
  );
};

export default Search;
