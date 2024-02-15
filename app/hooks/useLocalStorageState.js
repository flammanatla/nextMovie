"use client";

import { useState, useEffect } from "react";

export const useLocalStorageState = (initialValue, key) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    const storedValue = localStorage.getItem(key);

    if (storedValue) {
      setState(JSON.parse(storedValue));
    }
  }, [key]);

  const setValue = (newValue) => {
    try {
      setState((state) => {
        // If the passed value is a callback function,
        //  then call it with the new state.
        const valueToStore =
          newValue instanceof Function ? newValue(state) : newValue;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.log(error);
    }
  };

  return [state, setValue];
};
