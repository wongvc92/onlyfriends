import { useEffect, useState } from "react";
import useDebounce from "../common/useDebounce";
import { useNavigate, useSearch } from "@tanstack/react-router";

export const useSearchFriend = () => {
  const currentSearch = useSearch({ from: "/_authenticated/friends/_layout/list/" });
  const [query, setQuery] = useState(currentSearch.query || "");

  const debouncedQuery = useDebounce(query, 1000);
  const navigate = useNavigate({ from: "/friends/list" });
  useEffect(() => {
    if (debouncedQuery.trim()) {
      navigate({ search: { ...currentSearch, query: debouncedQuery } });
    } else {
      navigate({ search: { ...currentSearch, query: undefined } });
    }
  }, [debouncedQuery, currentSearch, navigate]);

  return { query, setQuery };
};
