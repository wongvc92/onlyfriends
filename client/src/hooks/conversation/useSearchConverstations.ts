import { useEffect, useState } from "react";
import useDebounce from "../useDebounce";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";

export const useSearchConversation = () => {
  const currentSearch = useSearch({ strict: false });
  const [inputValue, setInputValue] = useState(currentSearch.query || "");
  const { conversationId } = useParams({ strict: false });
  const debouncedQuery = useDebounce(inputValue, 300);
  const navigate = useNavigate({
    from: `/messages/conversations/${conversationId}`,
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
  }, [debouncedQuery, inputValue, currentSearch, navigate]);
  return { setInputValue, inputValue };
};
