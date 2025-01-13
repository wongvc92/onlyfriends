import { useEffect, useState } from "react";

export const useScrollStatus = (delay = 300) => {
  const [isScrolling, setIsScrolling] = useState(false);
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);

      // Clear any existing timeout and start a new one
      if (scrollTimeout) clearTimeout(scrollTimeout);

      // Reset scrolling state after 300ms of no scrolling
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, delay);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout); // Clear timeout when component unmounts
    };
  }, []);

  return { isScrolling };
};
