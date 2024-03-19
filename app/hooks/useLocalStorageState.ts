"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";

type SetLocalStorageState<T> = Dispatch<SetStateAction<T[]>>;

export const useLocalStorageState = <T>(
  key: string,
  initialValue: T[]
): [T[], SetLocalStorageState<T>] => {
  const [state, setState] = useState<T[]>(initialValue);

  useEffect(() => {
    const storedValue = localStorage.getItem(key);

    if (storedValue) {
      setState(JSON.parse(storedValue));
    }
  }, [key]);

  const setValue: SetLocalStorageState<T> = (newValue) => {
    try {
      setState((prevState) => {
        // If the passed value is a callback function,
        //  then call it with the new state.
        const valueToStore =
          newValue instanceof Function ? newValue(prevState) : newValue;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.log(error);
    }
  };

  return [state, setValue];
};
