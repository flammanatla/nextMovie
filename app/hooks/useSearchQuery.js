import { SEARCH_QUERY_PARAM } from "../utils/config";

export const useSearchQuery = () => {
  const searchQuery =
    new URLSearchParams(window.location.search).get(SEARCH_QUERY_PARAM) || "";
  return searchQuery;
};
