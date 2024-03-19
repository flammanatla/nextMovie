import { SetStateAction } from "react";

export interface SearchProps {
  query: string;
  setQuery: (value: string) => void;
  isShrinked: boolean;
}
