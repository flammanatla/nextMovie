import { SearchProps } from "./Search.types";

export default function Search({
  query,
  setQuery,
  isShrinked,
}: SearchProps): JSX.Element {
  return (
    <input
      className="search"
      type="text"
      placeholder={
        isShrinked ? "search here..." : "search over 300 000 movies..."
      }
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      id="search-input"
    />
  );
}
