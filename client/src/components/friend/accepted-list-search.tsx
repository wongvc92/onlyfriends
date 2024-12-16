import React from "react";
import { Input } from "../ui/input";
import { FaSearch } from "react-icons/fa";
import { useSearchFriend } from "@/hooks/friend/useSearchFriend";
import { useGetAcceptedFriends } from "@/hooks/friend/useGetAcceptedFriends";

const AcceptedListSearch = () => {
  const { data } = useGetAcceptedFriends();
  const { query, setQuery } = useSearchFriend();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQuery(query);
  };

  if (data?.pages[0].data.length === 0) return null;

  return (
    <div className="relative  max-w-xs">
      <Input placeholder="Search friends" className="pl-10 rounded-full" onChange={onInputChange} value={query} />
      <FaSearch className="absolute top-3 left-3" />
    </div>
  );
};

export default AcceptedListSearch;
