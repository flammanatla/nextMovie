import { useState, useEffect } from "react";

export const useSelectedId = () => {
  const [state, setState] = useState(null);

  useEffect(() => {
    setState(window.location.hash.slice(1));
  }, []);

  const setValue = (newValue) => {
    setState((state) => {
      // If the passed value is a callback function,
      //  then call it with the new state.
      const valueToUpdate =
        newValue instanceof Function ? newValue(state) : newValue;
      window.location.hash = valueToUpdate || "";
      return valueToUpdate;
    });
  };

  return [state, setValue];
};
