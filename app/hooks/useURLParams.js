import { useState, useEffect } from "react";

import { updateQueryParams } from "../utils/helpers.js";

export const useURLParams = (key, initialState) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const searchQuery =
      new URLSearchParams(window.location.search).get(key) || "";
    setState(searchQuery);
  }, [key]);

  const setValue = (newValue) => {
    try {
      setState((state) => {
        // If the passed value is a callback function,
        //  then call it with the new state.
        const valueToUpdate =
          newValue instanceof Function ? newValue(state) : newValue;
        updateQueryParams(key, valueToUpdate || "");
        setState(valueToUpdate);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return [state, setValue];
};
