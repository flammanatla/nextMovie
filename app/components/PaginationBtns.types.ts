import { SetStateAction } from "react";

export interface PaginationBtnsProps {
  totalSearchResults: number;
  currentPage: number;
  onPageNavigation: (value: number) => void;
  isLoading: boolean;
}
