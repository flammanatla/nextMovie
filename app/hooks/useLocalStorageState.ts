"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";

type LocalStorageState = string | [];
type SetLocalStorageState = Dispatch<SetStateAction<string | []>>;

export const useLocalStorageState = (key: string, initialValue: []) => {
  const [state, setState] = useState<LocalStorageState>(initialValue);

  useEffect(() => {
    const storedValue = localStorage.getItem(key);

    if (storedValue) {
      setState(JSON.parse(storedValue));
    }
  }, [key]);

  const setValue: SetLocalStorageState = (newValue) => {
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
