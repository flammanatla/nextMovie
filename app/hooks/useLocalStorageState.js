"use client";

import { useState, useEffect } from "react";

// export function useLocalStorageState(initialState, key) {
//   const [value, setValue] = useState(() => {
//     return localStorage.getItem(key) !== null
//       ? JSON.parse(localStorage.getItem(key))
//       : initialState;
//   });

//   useEffect(
//     function () {
//       localStorage.setItem(key, JSON.stringify(value));
//     },
//     [value, key]
//   );

//   return [value, setValue];
// }

// Uncaught Error: There was an error while hydrating.
// export function useLocalStorageState(initialState, key) {
//   const [value, setValue] = useState(() => {
//     if (typeof window !== "undefined") {
//       return localStorage.getItem(key) !== null
//         ? JSON.parse(localStorage.getItem(key))
//         : initialState;
//     }
//     return initialState;
//   });

//   useEffect(
//     function () {
//       localStorage.setItem(key, JSON.stringify(value));
//     },
//     [value, key]
//   );

//   return [value, setValue];
// }

// endless re-rendering
// export function useLocalStorageState(initialState, key) {
//   const [value, setValue] = useState(initialState);
//   const [isLoaded, setLoaded] = useState(false);

//   useEffect(() => {
//     // if (isLoaded) {
//     //   return;
//     // }

//     // setLoaded(true);

//     const storedValue = localStorage.getItem(key);

//     console.log("got from storage", { storedValue });
//     setValue(storedValue !== null ? JSON.parse(storedValue) : initialState);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem(key, JSON.stringify(value));
//   }, [value, key]);

//   // const getValue = () => {
//   //   if (typeof window !== "undefined") {
//   //     return initialState;
//   //   }
//   //   const storedValue = localStorage.getItem(key);
//   //   return storedValue !== null ? JSON.parse(storedValue) : initialState;
//   // };

//   // const setValueNew = (value) => {
//   //   localStorage.setItem(key, JSON.stringify(value));
//   // };

//   return [value, setValue];
// }

// export const getLocalStorageValue = (initialState) => {
//   if (typeof window !== "undefined") {
//     return initialState;
//   }
//   const storedValue = localStorage.getItem(key);
//   return storedValue !== null ? JSON.parse(storedValue) : initialState;
// };

// export const setLocalStorageValue = (value) => {
//   localStorage.setItem(key, JSON.stringify(value));
// };

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
