import { useState, useEffect } from "react";

export const useDebouncer = (query: string) => {
  const [debouncer, setDebouncer] = useState<string>("");

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
