import { useState, useEffect } from "react";

import { updateQueryParams } from "../utils/helpers.js";

export const useURLParams = (key) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const searchQuery =
      new URLSearchParams(window.location.search).get(key) || "";

    setQuery(searchQuery);
  }, []);

  const setValue = (value) => {
    try {
      updateQueryParams(key, value || "");
      setQuery(value);
    } catch (error) {
      console.log(error);
    }
  };

  return [query, setValue];
};
