import { useEffect, useState } from "react";
import useDebounce from "../common/useDebounce";
import { useNavigate, useSearch } from "@tanstack/react-router";

export const useSearchConversation = () => {
  const currentSearch = useSearch({ strict: false });
  const [inputValue, setInputValue] = useState(currentSearch.query || "");

  const debouncedQuery = useDebounce(inputValue, 300);

  const navigate = useNavigate({
    from: `/messages/conversations`,
  });
  useEffect(() => {
    if (debouncedQuery === "") {
      navigate({
        search: {
          ...currentSearch,
          query: undefined,
        },
        replace: true,
      });
    } else {
      navigate({
        search: {
          ...currentSearch,
          query: debouncedQuery,
        },
        replace: true,
      });
    }
  }, [debouncedQuery, currentSearch, navigate]);
  return { setInputValue, inputValue };
};
