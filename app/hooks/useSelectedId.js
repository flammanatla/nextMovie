import { useState, useEffect } from "react";

export const useSelectedId = () => {
  const [state, setState] = useState(null);

  useEffect(() => {
    setState(window.location.hash.slice(1));
  }, []);

  const setValue = (value) => {
    setState(value);
    window.location.hash = value || "";
  };

  return [state, setValue];
};
