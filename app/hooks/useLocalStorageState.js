"use client";

import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key) !== null
      ? JSON.parse(localStorage.getItem(key))
      : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}

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

//   useEffect(() => {
//     const storedValue = localStorage.getItem(key);
//     setValue(storedValue !== null ? JSON.parse(storedValue) : initialState);
//   }, [initialState, key]);

//   useEffect(
//     function () {
//       localStorage.setItem(key, JSON.stringify(value));
//     },
//     [value, key]
//   );

//   return [value, setValue];
// }
