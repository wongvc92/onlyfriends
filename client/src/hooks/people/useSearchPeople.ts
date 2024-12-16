import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import useDebounce from "../common/useDebounce";

export const useSearchPeople = () => {
  const currentSearch = useSearch({ from: "/_authenticated/friends/_layout/find/" });
  const [query, setQuery] = useState(currentSearch.query || "");
  const debouncedQuery = useDebounce(query, 300);

  const navigate = useNavigate({ from: "/friends/find" });

  useEffect(() => {
    if (debouncedQuery.trim()) {
      navigate({
        search: { ...currentSearch, query: debouncedQuery },
        replace: true,
      });
    } else {
      navigate({
        search: { ...currentSearch, query: undefined },
        replace: true,
      });
    }
  }, [debouncedQuery]);

  return { query, setQuery };
};
