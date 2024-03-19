import { useState, useEffect } from "react";

import { API_URL, API_KEY, MINIMAL_QUERY_LENGTH } from "../utils/config";
import { lowercaseKey, getErrorMessage } from "../utils/helpers";

import { SearchMovie } from "../components/Movie.types";

export function useMovies(query: string, currentPage: number) {
  console.log({ currentPage });
  const [movies, setMovies] = useState<Array<SearchMovie>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [totalSearchResults, setTotalSearchResults] = useState<number | null>(
    null
  );

  //to do: rewrite as an eventListener since we don't need to do data fetching on the mount anymore
  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `${API_URL}?apikey=${API_KEY}&s=${query}&page=${currentPage}`,
            {
              signal: controller.signal,
            }
          );

          if (!res.ok) {
            throw new Error("Something went wrong with fetching movies data");
          }

          const data: {
            Response: "True" | "False";
            Search: object[];
            totalResults: string;
          } = await res.json();

          if (data.Response === "False") {
            throw new Error(
              "Movie not found. Search query length should be minimum 3 symbols."
            );
          }
          const mappedSearch = data.Search.map(
            (searchItem) => lowercaseKey(searchItem) as SearchMovie
          );

          setMovies(mappedSearch);
          setTotalSearchResults(Number(data.totalResults));
          setError("");
        } catch (err) {
          const error = getErrorMessage(err);
          if (typeof error === "string") {
            console.log(error);
          }
          if (typeof error !== "string" && error.name !== "AbortError") {
            setError(error.message);
            setTotalSearchResults(null);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < MINIMAL_QUERY_LENGTH) {
        setMovies([]);
        setError("");
        setTotalSearchResults(null);
        return;
      }

      //handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query, currentPage]
  );

  return { movies, isLoading, error, totalSearchResults };
}
