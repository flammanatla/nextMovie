import { useState, useEffect, SetStateAction, Dispatch } from "react";

type SetSelectedIdState = Dispatch<SetStateAction<string | null>>;

export const useSelectedId = (): [string | null, SetSelectedIdState] => {
  const [state, setState] = useState<string | null>(null);

  useEffect(() => {
    setState(window.location.hash.slice(1));
  }, []);

  const setValue: SetSelectedIdState = (newValue) => {
    setState((prevState) => {
      // If the passed value is a callback function,
      //  then call it with the new state.
      const valueToUpdate =
        newValue instanceof Function ? newValue(prevState) : newValue;
      window.location.hash = valueToUpdate || "";
      return valueToUpdate;
    });
  };

  return [state, setValue];
};
