import { useState, useEffect } from "react";

import { updateQueryParams } from "../utils/helpers.js";

export const useURLParams = (key) => {
  const [state, setState] = useState("");

  useEffect(() => {
    const searchQuery =
      new URLSearchParams(window.location.search).get(key) || "";
    setState(searchQuery);
  }, [key]);

  const setValue = (value) => {
    try {
      updateQueryParams(key, value || "");
      setState(value);
    } catch (error) {
      console.log(error);
    }
  };

  return [state, setValue];
};
