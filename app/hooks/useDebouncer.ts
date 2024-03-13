import { useState, useEffect } from "react";

export const useDebouncer = (query) => {
  const [debouncer, setDebouncer] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncer(query);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  return debouncer;
};
