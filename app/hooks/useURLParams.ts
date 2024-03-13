import { useState, useEffect, Dispatch, SetStateAction } from "react";

import { updateQueryParams } from "../utils/helpers";

type URLParamsState = string | null;
type SetURLParamsState = Dispatch<SetStateAction<string | null>>;

export const useURLParams = (
  key: string,
  initialState: URLParamsState
): [URLParamsState, SetURLParamsState] => {
  const [state, setState] = useState<URLParamsState>(initialState);

  useEffect(() => {
    const searchQuery =
      new URLSearchParams(window.location.search).get(key) || "";
    setState(searchQuery);
  }, [key]);

  const setValue: SetURLParamsState = (newValue) => {
    try {
      setState((prevState) => {
        // If the passed value is a callback function,
        //  then call it with the new state.
        const valueToUpdate =
          newValue instanceof Function ? newValue(prevState) : newValue;
        updateQueryParams(key, valueToUpdate || "");
        return valueToUpdate;
      });
    } catch (error) {
      console.log(error);
    }
  };

  return [state, setValue];
};
