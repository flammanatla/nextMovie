import { useRef } from "react";

import { useKey } from "../hooks/useKey.js";

//https://flammanatla.github.io/portfolio/cinesearch/dist/?q=harry
export default function Search({ query, setQuery, isShrinked }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) {
      return;
    }

    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder={
        isShrinked ? "search here..." : "search over 300 000 movies..."
      }
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
      id="search-input"
    />
  );
}
