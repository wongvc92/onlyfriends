import { useCallback, useRef, useState } from "react";
import useDebounce from "./useDebounce";

export const useTagging = () => {
  const [atSymbolIndex, setAtSymbolIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [isTagging, setIstagging] = useState(false);
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const debouncedSearch = useDebounce(search, 1000);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setContent(text);

      const atSymbolIndex = text.lastIndexOf("@");

      if (atSymbolIndex !== -1) {
        setAtSymbolIndex(atSymbolIndex);
        const potentialQuery = text.slice(atSymbolIndex + 1);
        setSearch(potentialQuery);
        setIstagging(true);
      } else {
        setSearch("");
        setIstagging(true);
      }
    },
    []
  );

  const handleTaggedFriend = useCallback(
    (username: string) => {
      const newText =
        content.slice(0, atSymbolIndex) +
        `@${username} ` +
        content.slice(atSymbolIndex + search.length + 1);
      setContent(newText);
      // Clear the search and atSymbolIndex states
      setSearch("");
      setAtSymbolIndex(0);
      setIstagging(false);
      textareaRef.current?.focus();
      return newText;
    },
    [content, atSymbolIndex, search]
  );

  return {
    handleTaggedFriend,
    isTagging,
    debouncedSearch,
    content,
    handleInputChange,
    textareaRef,
  };
};
