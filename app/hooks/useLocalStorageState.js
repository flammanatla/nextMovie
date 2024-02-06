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

  const setValue = (value) => {
    try {
      // If the passed value is a callback function,
      //  then call it with the existing state.
      const valueToStore = value instanceof Function ? value(state) : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      setState(value);
    } catch (error) {
      console.log(error);
    }
  };

  return [state, setValue];
};
